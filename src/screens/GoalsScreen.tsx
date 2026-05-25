import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getGoals, addGoal, updateGoal, deleteGoal, formatCOP, Goal } from '../storage/appStorage';

const ICONS = ['🏖️', '🛡️', '📱', '🏠', '🚗', '✈️', '💊', '📚'];

const GoalsScreen = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [abonoModal, setAbonoModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('🏖️');
  const [abono, setAbono] = useState('');

  const loadData = useCallback(() => {
  const fetchData = async () => {
    const g = await getGoals();
    setGoals(g);
  };
  fetchData();
}, []);

  const handleAdd = async () => {
    const num = parseFloat(target.replace(/\./g, ''));
    if (!name || !num) return;
    const deadlineDate = deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
    await addGoal({ name, targetAmount: num, savedAmount: 0, deadline: deadlineDate, icon });
    setName(''); setTarget(''); setDeadline(''); setIcon('🏖️');
    setModalVisible(false);
    loadData();
  };

  const handleAbono = async () => {
    if (!selectedGoal) return;
    const num = parseFloat(abono.replace(/\./g, ''));
    if (!num || num <= 0) return;
    await updateGoal({ ...selectedGoal, savedAmount: selectedGoal.savedAmount + num });
    setAbono(''); setAbonoModal(false); setSelectedGoal(null);
    loadData();
  };

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" translucent={false} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Metas de ahorro</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.newBtnText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {goals.length > 0 && (
          <Text style={styles.sectionLabel}>EN PROGRESO ({goals.length})</Text>
        )}

        {goals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>No tienes metas aún</Text>
            <Text style={styles.emptySubText}>Crea tu primera meta de ahorro</Text>
          </View>
        ) : (
          goals.map(g => {
            const pct = g.targetAmount > 0 ? Math.round((g.savedAmount / g.targetAmount) * 100) : 0;
            const daysLeft = getDaysLeft(g.deadline);
            const remaining = g.targetAmount - g.savedAmount;

            return (
              <TouchableOpacity key={g.id} style={styles.goalCard}
                onPress={() => { setSelectedGoal(g); setAbonoModal(true); }}>
                <View style={styles.goalLeft}>
                  {/* Círculo de progreso simple */}
                  <View style={styles.progressCircle}>
                    <Text style={styles.progressIcon}>{g.icon}</Text>
                    <View style={[styles.progressArc, { borderColor: '#2979ff' }]} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.goalTopRow}>
                    <Text style={styles.goalName}>{g.name}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#ccc" />
                  </View>
                  <Text style={styles.goalAmounts}>
                    {formatCOP(g.savedAmount)} / {formatCOP(g.targetAmount)}
                    <Text style={styles.goalPct}> {pct}%</Text>
                  </Text>
                  <View style={styles.goalBarBg}>
                    <View style={[styles.goalBarFill, { width: `${Math.min(pct, 100)}%` }]} />
                  </View>
                  <Text style={styles.goalMeta}>
                    {daysLeft} días restantes · Faltan {formatCOP(remaining)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => { deleteGoal(g.id); loadData(); }} style={{ paddingLeft: 8 }}>
                  <Ionicons name="trash-outline" size={16} color="#ddd" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Modal nueva meta */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nueva meta</Text>
            <Text style={styles.inputLabel}>Ícono</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {ICONS.map(ic => (
                <TouchableOpacity key={ic} onPress={() => setIcon(ic)}
                  style={[styles.iconChip, icon === ic && styles.iconChipActive]}>
                  <Text style={{ fontSize: 22 }}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.inputLabel}>Nombre de la meta</Text>
            <TextInput style={styles.input} placeholder="Ej: Vacaciones Cartagena" value={name} onChangeText={setName} />
            <Text style={styles.inputLabel}>Monto objetivo (COP)</Text>
            <TextInput style={styles.input} placeholder="Ej: 2000000" keyboardType="numeric" value={target} onChangeText={setTarget} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnText}>Crear meta</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal abono */}
      <Modal visible={abonoModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setAbonoModal(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Registrar abono</Text>
            <Text style={styles.inputLabel}>Monto a abonar (COP)</Text>
            <TextInput style={styles.input} placeholder="Ej: 100000" keyboardType="numeric" value={abono} onChangeText={setAbono} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAbono}>
              <Text style={styles.saveBtnText}>Abonar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f7fa', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  newBtn: { backgroundColor: '#fff8e1', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  newBtnText: { color: '#f5a623', fontWeight: '600', fontSize: 14 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#999', letterSpacing: 1, marginBottom: 12 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#333' },
  emptySubText: { fontSize: 13, color: '#999', marginTop: 4 },
  goalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 1 },
  goalLeft: { alignItems: 'center', justifyContent: 'center' },
  progressCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#e0eaff', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  progressIcon: { fontSize: 24 },
  progressArc: { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderLeftColor: 'transparent', borderBottomColor: 'transparent' },
  goalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalName: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  goalAmounts: { fontSize: 13, color: '#666', marginTop: 4 },
  goalPct: { color: '#2979ff', fontWeight: '700' },
  goalBarBg: { height: 4, backgroundColor: '#f0f0f0', borderRadius: 2, marginVertical: 8 },
  goalBarFill: { height: 4, backgroundColor: '#2979ff', borderRadius: 2 },
  goalMeta: { fontSize: 12, color: '#999' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#f5f7fa', borderRadius: 12, borderWidth: 1, borderColor: '#e0e7ef', padding: 14, fontSize: 15, marginBottom: 20 },
  iconChip: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  iconChipActive: { backgroundColor: '#eef3ff', borderWidth: 2, borderColor: '#2979ff' },
  saveBtn: { backgroundColor: '#2979ff', borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default GoalsScreen;
