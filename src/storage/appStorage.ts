import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── TIPOS ───────────────────────────────────────────────
export type TransactionType = 'ingreso' | 'gasto';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'Mensual' | 'Semanal';
  icon: string;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string; // ISO string
  icon: string;
}

export interface AppSettings {
  tipsEnabled: boolean;
  notificationsEnabled: boolean;
  budgetAlertsPerCategory: Record<string, boolean>;
}

// ─── KEYS ────────────────────────────────────────────────
const KEYS = {
  transactions: 'netcash_transactions',
  budgets: 'netcash_budgets',
  goals: 'netcash_goals',
  settings: 'netcash_settings',
};

// ─── HELPERS ─────────────────────────────────────────────
const load = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
};

const save = async <T>(key: string, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

// ─── TRANSACTIONS ─────────────────────────────────────────
export const getTransactions = () => load<Transaction[]>(KEYS.transactions, []);

export const addTransaction = async (t: Omit<Transaction, 'id'>): Promise<void> => {
  const all = await getTransactions();
  const newT: Transaction = { ...t, id: Date.now().toString() };
  await save(KEYS.transactions, [newT, ...all]);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const all = await getTransactions();
  await save(KEYS.transactions, all.filter(t => t.id !== id));
};

// ─── BUDGETS ──────────────────────────────────────────────
export const getBudgets = () => load<Budget[]>(KEYS.budgets, DEFAULT_BUDGETS);

export const addBudget = async (b: Omit<Budget, 'id'>): Promise<void> => {
  const all = await getBudgets();
  await save(KEYS.budgets, [...all, { ...b, id: Date.now().toString() }]);
};

export const updateBudget = async (b: Budget): Promise<void> => {
  const all = await getBudgets();
  await save(KEYS.budgets, all.map(x => x.id === b.id ? b : x));
};

export const deleteBudget = async (id: string): Promise<void> => {
  const all = await getBudgets();
  await save(KEYS.budgets, all.filter(b => b.id !== id));
};

// ─── GOALS ────────────────────────────────────────────────
export const getGoals = () => load<Goal[]>(KEYS.goals, []);

export const addGoal = async (g: Omit<Goal, 'id'>): Promise<void> => {
  const all = await getGoals();
  await save(KEYS.goals, [...all, { ...g, id: Date.now().toString() }]);
};

export const updateGoal = async (g: Goal): Promise<void> => {
  const all = await getGoals();
  await save(KEYS.goals, all.map(x => x.id === g.id ? g : x));
};

export const deleteGoal = async (id: string): Promise<void> => {
  const all = await getGoals();
  await save(KEYS.goals, all.filter(g => g.id !== id));
};

// ─── SETTINGS ─────────────────────────────────────────────
export const getSettings = () => load<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);

export const saveSettings = (s: AppSettings) => save(KEYS.settings, s);

// ─── UTILS ────────────────────────────────────────────────
export const formatCOP = (amount: number): string => {
  return '$' + amount.toLocaleString('es-CO');
};

export const getMonthTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
};

export const getTodayTransactions = (transactions: Transaction[]): Transaction[] => {
  const today = new Date().toDateString();
  return transactions.filter(t => new Date(t.date).toDateString() === today);
};

export const getSpentByCategory = (transactions: Transaction[], category: string): number => {
  return getMonthTransactions(transactions)
    .filter(t => t.type === 'gasto' && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
};

// ─── DEFAULTS ─────────────────────────────────────────────
const DEFAULT_BUDGETS: Budget[] = [
  { id: '1', category: 'Alimentación', limit: 500000, period: 'Mensual', icon: 'restaurant-outline', color: '#4caf50' },
  { id: '2', category: 'Transporte', limit: 150000, period: 'Mensual', icon: 'bus-outline', color: '#2196f3' },
  { id: '3', category: 'Entretenimiento', limit: 150000, period: 'Mensual', icon: 'film-outline', color: '#9c27b0' },
  { id: '4', category: 'Salud', limit: 200000, period: 'Mensual', icon: 'medkit-outline', color: '#f44336' },
];

const DEFAULT_SETTINGS: AppSettings = {
  tipsEnabled: true,
  notificationsEnabled: true,
  budgetAlertsPerCategory: {
    'Alimentación': true,
    'Transporte': true,
    'Entretenimiento': true,
    'Salud': false,
  },
};
