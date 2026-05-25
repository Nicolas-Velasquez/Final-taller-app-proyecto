import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Dimensions, Modal, TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getTransactions, addTransaction, deleteTransaction,
  getBudgets, getSpentByCategory, formatCOP,
  getMonthTransactions, getTodayTransactions,
  Transaction,
} from '../storage/appStorage';

const { width } = Dimensions.get('window');

const TIPS = [
  'Lleva un registro de cada gasto, por pequeño que sea. Los pequeños gastos suman más de lo que crees.',
  'Ahorra al menos el 10% de tus ingresos antes de gastar.',
  'Revisa tus presupuestos cada semana para mantenerte al día.',
  'Evita las compras impulsivas esperando 24 horas antes de decidir.',
];

const CATEGORIES = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Ropa', 'Otro'];

interface HomeScreenProps {
  username: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ username }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addType, setAddType] = useState<'ingreso' | 'gasto'>('gasto');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Alimentación');
  const tip = TIPS[new Date().getDay() % TIPS.length];

  const loadData = useCallback(() => {
  const fetchData = async () => {
    setLoading(true);
    const [t, b] = await Promise.all([getTransactions(), getBudgets()]);
    setTransactions(t);
    setBudgets(b);
    setLoading(false);
  };
  fetchData();
}, []);

  const monthTx = getMonthTransactions(transactions);
  const todayTx = getTodayTransactions(transactions);
  const totalIngresos = monthTx.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const totalGastos = monthTx.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  const balance = totalIngresos - totalGastos;

  const alertBudget = budgets.find(b => {
    const spent = getSpentByCategory(transactions, b.category);
    return spent / b.limit >= 0.8;
  });

  const handleAdd = async () => {
    const num = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!num || num <= 0) return;
    await addTransaction({
      type: addType,
      amount: num,
      category,
      description: description || category,
      date: new Date().toISOString(),
    });
    setAmount('');
    setDescription('');
    setCategory('Alimentación');
    setAddModalVisible(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    loadData();
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#2979ff" translucent={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header azul */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.greetText}>Hola, {username} 👋</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>BALANCE TOTAL</Text>
          <Text style={styles.balanceAmount}>{formatCOP(balance)}</Text>
          <View style={styles.ingresoGastoRow}>
            <View style={styles.igCard}>
              <View style={[styles.igIcon, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="trending-up" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.igLabel}>Ingresos</Text>
                <Text style={styles.igAmount}>{formatCOP(totalIngresos)}</Text>
              </View>
            </View>
            <View style={styles.igCard}>
              <View style={[styles.igIcon, { backgroundColor: '#f44336' }]}>
                <Ionicons name="trending-down" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.igLabel}>Gastos</Text>
                <Text style={styles.igAmount}>{formatCOP(totalGastos)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Alerta presupuesto */}
          {alertBudget && (
            <TouchableOpacity style={styles.alertCard}>
              <Ionicons name="warning-outline" size={18} color="#f5a623" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.alertTitle}>⚠️ Alerta de presupuesto</Text>
                <Text style={styles.alertSub}>{alertBudget.category}: {Math.round(getSpentByCategory(transactions, alertBudget.category) / alertBudget.limit * 100)}% usado</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#aaa" />
            </TouchableOpacity>
          )}

          {/* Tip del día */}
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={18} color="#2979ff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>TIP DEL DÍA</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          </View>

          {/* Accesos rápidos */}
          <Text style={styles.sectionTitle}>ACCESOS RÁPIDOS</Text>
          <View style={styles.quickRow}>
            <View style={[styles.quickCard, { backgroundColor: '#eef3ff' }]}>
              <Ionicons name="bar-chart-outline" size={28} color="#2979ff" />
              <Text style={[styles.quickLabel, { color: '#2979ff' }]}>Presupuestos</Text>
            </View>
            <View style={[styles.quickCard, { backgroundColor: '#fff8e1' }]}>
              <Ionicons name="trophy-outline" size={28} color="#f5a623" />
              <Text style={[styles.quickLabel, { color: '#f5a623' }]}>Metas</Text>
            </View>
          </View>

          {/* Transacciones de hoy */}
          <Text style={styles.sectionTitle}>HOY</Text>
          {loading ? (
            <ActivityIndicator color="#2979ff" style={{ marginTop: 20 }} />
          ) : todayTx.length === 0 ? (
            <Text style={styles.emptyText}>Sin transacciones hoy</Text>
          ) : (
            todayTx.map(t => (
              <View key={t.id} style={styles.txRow}>
                <View style={styles.txIcon}>
                  <Ionicons name="receipt-outline" size={20} color="#666" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txDesc} numberOfLines={1}>{t.description}</Text>
                  <Text style={styles.txMeta}>{t.category} · {new Date(t.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <Text style={[styles.txAmount, { color: t.type === 'ingreso' ? '#4caf50' : '#f44336' }]}>
                  {t.type === 'ingreso' ? '+' : '-'}{formatCOP(t.amount)}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(t.id)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={18} color="#ccc" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB + */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal selector gasto/ingreso */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.selectorModal}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>¿Qué quieres registrar?</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.selectorRow}>
              <TouchableOpacity style={[styles.selectorCard, { backgroundColor: '#fff0f0' }]}
                onPress={() => { setAddType('gasto'); setModalVisible(false); setAddModalVisible(true); }}>
                <View style={[styles.selectorIcon, { backgroundColor: '#f44336' }]}>
                  <Ionicons name="trending-down" size={24} color="#fff" />
                </View>
                <Text style={[styles.selectorCardTitle, { color: '#f44336' }]}>Gasto</Text>
                <Text style={styles.selectorCardSub}>Registrar un egreso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.selectorCard, { backgroundColor: '#f0fff4' }]}
                onPress={() => { setAddType('ingreso'); setModalVisible(false); setAddModalVisible(true); }}>
                <View style={[styles.selectorIcon, { backgroundColor: '#4caf50' }]}>
                  <Ionicons name="trending-up" size={24} color="#fff" />
                </View>
                <Text style={[styles.selectorCardTitle, { color: '#4caf50' }]}>Ingreso</Text>
                <Text style={styles.selectorCardSub}>Registrar un ingreso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal agregar transacción */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setAddModalVisible(false)}>
          <View style={styles.addModal}>
            <Text style={styles.addModalTitle}>
              {addType === 'gasto' ? '💸 Registrar Gasto' : '💰 Registrar Ingreso'}
            </Text>

            <Text style={styles.inputLabel}>Monto (COP)</Text>
            <TextInput
              style={styles.inputField}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Ej: Almuerzo, Bus..."
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.inputLabel}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                >
                  <Text style={[styles.catChipText, category === cat && { color: '#fff' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: addType === 'gasto' ? '#f44336' : '#4caf50' }]}
              onPress={handleAdd}
            >
              <Text style={styles.addBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f7fa', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44 },
  header: { backgroundColor: '#2979ff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 80 },
  dateText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  greetText: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 2 },
  bellBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  balanceCard: { backgroundColor: '#2979ff', marginHorizontal: 16, marginTop: -60, borderRadius: 20, padding: 20, elevation: 6 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, letterSpacing: 1 },
  balanceAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginVertical: 6 },
  ingresoGastoRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  igCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  igIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  igLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  igAmount: { color: '#fff', fontSize: 14, fontWeight: '700' },
  body: { padding: 16, paddingBottom: 100 },
  alertCard: { backgroundColor: '#fff8e1', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#ffe082' },
  alertTitle: { fontSize: 13, fontWeight: '700', color: '#333' },
  alertSub: { fontSize: 12, color: '#666', marginTop: 2 },
  tipCard: { backgroundColor: '#eef3ff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  tipIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dce8f8', alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontSize: 11, fontWeight: '700', color: '#2979ff', letterSpacing: 1, marginBottom: 4 },
  tipText: { fontSize: 13, color: '#444', lineHeight: 19 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#999', letterSpacing: 1, marginBottom: 12 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 },
  quickLabel: { fontSize: 13, fontWeight: '600' },
  emptyText: { color: '#bbb', textAlign: 'center', marginTop: 20, fontSize: 14 },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 },
  txIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f7fa', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txDesc: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  txMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 28, alignSelf: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: '#2979ff', alignItems: 'center', justifyContent: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  selectorModal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  selectorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  selectorTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  selectorRow: { flexDirection: 'row', gap: 16, paddingBottom: 24 },
  selectorCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center', gap: 10 },
  selectorIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  selectorCardTitle: { fontSize: 16, fontWeight: '700' },
  selectorCardSub: { fontSize: 12, color: '#888' },
  addModal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  addModalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  inputField: { backgroundColor: '#f5f7fa', borderRadius: 12, borderWidth: 1, borderColor: '#e0e7ef', padding: 14, fontSize: 15, marginBottom: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  catChipActive: { backgroundColor: '#2979ff' },
  catChipText: { fontSize: 13, color: '#555' },
  addBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default HomeScreen;
