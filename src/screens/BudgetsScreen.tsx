import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getBudgets, addBudget, deleteBudget, getTransactions,
  getSpentByCategory, formatCOP, getMonthTransactions, Budget,
} from '../storage/appStorage';

const CATEGORIES = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Ropa', 'Otro'];

const BudgetsScreen = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('Alimentación');
  const [limit, setLimit] = useState('');

  const loadData = useCallback(async () => {
    const [b, t] = await Promise.all([getBudgets(), getTransactions()]);
    setBudgets(b);
    setTransactions(t);
  }, []);

  useFocusEffect(loadData);

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + getSpentByCategory(transactions, b.category), 0);

  const handleAdd = async () => {
    const num = parseFloat(limit.replace(/\./g, ''));
    if (!num || num <= 0) return;
    await addBudget({ category, limit: num, period: 'Mensual', icon: 'receipt-outline', color: '#2979ff' });
    setLimit('');
    setModalVisible(false);
    loadData();
  };

  const getBarColor = (pct: number) => {
    if (pct >= 99) return '#f44336';
    if (pct >= 80) return '#f5a623';
    return '#4caf50';
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" translucent={false} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Presupuestos</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.newBtnText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Resumen total */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Gasto total este mes</Text>
          <Text style={styles.summaryAmount}>{formatCOP(totalSpent)}</Text>
          <Text style={styles.summaryOf}>de {formatCOP(totalLimit)} presupuestado</Text>
          <View style={styles.summaryBarBg}>
            <View style={[styles.summaryBarFill, { width: `${Math.min(totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0, 100)}%` }]} />
          </View>
        </View>

        {/* Lista de presupuestos */}
        <View style={styles.list}>
          {budgets.map(b => {
            const spent = getSpentByCategory(transactions, b.category);
            const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
            const color = getBarColor(pct);
            const isAlert = pct >= 80;

            return (
              <View key={b.id} style={[styles.budgetCard, isAlert && pct >= 99 && { borderColor: '#f5a623', borderWidth: 1.5 }]}>
                <View style={styles.budgetTop}>
                  <View style={styles.budgetIconWrap}>
                    <Ionicons name={b.icon as any} size={22} color="#555" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.budgetName}>{b.category}</Text>
                    <Text style={styles.budgetPeriod}>{b.period}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {pct >= 80 && <Ionicons name="warning-outline" size={14} color="#f5a623" />}
                    <Text style={[styles.budgetPct, { color }]}>{pct}%</Text>
                    <TouchableOpacity onPress={() => { deleteBudget(b.id); loadData(); }}>
                      <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
                </View>
                <View style={styles.budgetBottom}>
                  <Text style={styles.budgetSpent}>Gastado: <Text style={{ color, fontWeight: '700' }}>{formatCOP(spent)}</Text></Text>
                  <Text style={styles.budgetLimit}>Límite: {formatCOP(b.limit)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal nuevo presupuesto */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo presupuesto</Text>
            <Text style={styles.inputLabel}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} onPress={() => setCategory(cat)}
                  style={[styles.chip, category === cat && styles.chipActive]}>
                  <Text style={[styles.chipText, category === cat && { color: '#fff' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.inputLabel}>Límite mensual (COP)</Text>
            <TextInput style={styles.input} placeholder="Ej: 500000" keyboardType="numeric" value={limit} onChangeText={setLimit} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnText}>Guardar</Text>
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
  newBtn: { backgroundColor: '#eef3ff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  newBtnText: { color: '#2979ff', fontWeight: '600', fontSize: 14 },
  summaryCard: { backgroundColor: '#2979ff', margin: 16, borderRadius: 20, padding: 20 },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  summaryAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginVertical: 4 },
  summaryOf: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 14 },
  summaryBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 },
  summaryBarFill: { height: 8, backgroundColor: '#fff', borderRadius: 4 },
  list: { paddingHorizontal: 16 },
  budgetCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  budgetTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  budgetIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#f5f7fa', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  budgetName: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  budgetPeriod: { fontSize: 12, color: '#999', marginTop: 2 },
  budgetPct: { fontSize: 14, fontWeight: '700' },
  barBg: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 10 },
  barFill: { height: 8, borderRadius: 4 },
  budgetBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetSpent: { fontSize: 12, color: '#666' },
  budgetLimit: { fontSize: 12, color: '#999' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#f5f7fa', borderRadius: 12, borderWidth: 1, borderColor: '#e0e7ef', padding: 14, fontSize: 15, marginBottom: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  chipActive: { backgroundColor: '#2979ff' },
  chipText: { fontSize: 13, color: '#555' },
  saveBtn: { backgroundColor: '#2979ff', borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default BudgetsScreen;
