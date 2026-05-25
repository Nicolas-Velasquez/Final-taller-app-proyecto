import React, { useState } from 'react';
import {
  View, TouchableOpacity, StyleSheet, Text, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import BudgetsScreen from './BudgetsScreen';
import GoalsScreen from './GoalsScreen';
import SettingsScreen from './SettingsScreen';

const { width } = Dimensions.get('window');

type Tab = 'home' | 'budgets' | 'goals' | 'settings';

interface MainAppProps {
  username: string;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ username, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen username={username} />;
      case 'budgets': return <BudgetsScreen />;
      case 'goals': return <GoalsScreen />;
      case 'settings': return <SettingsScreen username={username} onLogout={onLogout} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Pantalla activa */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Barra de navegación inferior */}
      <View style={styles.tabBar}>
        <TabButton icon="home-outline" iconActive="home" label="Inicio" active={activeTab === 'home'} onPress={() => setActiveTab('home')} />
        <TabButton icon="pie-chart-outline" iconActive="pie-chart" label="Presupuestos" active={activeTab === 'budgets'} onPress={() => setActiveTab('budgets')} />

        {/* Botón + central vacío (el FAB está en HomeScreen) */}
        <View style={styles.fabSpace} />

        <TabButton icon="flag-outline" iconActive="flag" label="Metas" active={activeTab === 'goals'} onPress={() => setActiveTab('goals')} />
        <TabButton icon="ellipsis-horizontal-outline" iconActive="ellipsis-horizontal" label="Más" active={activeTab === 'settings'} onPress={() => setActiveTab('settings')} />
      </View>
    </View>
  );
};

interface TabButtonProps {
  icon: string;
  iconActive: string;
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, iconActive, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabBtn} onPress={onPress}>
    <Ionicons name={(active ? iconActive : icon) as any} size={24} color={active ? '#2979ff' : '#aaa'} />
    <Text style={[styles.tabLabel, active && { color: '#2979ff' }]}>{label}</Text>
    {active && <View style={styles.tabDot} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'android' ? 8 : 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 10,
    alignItems: 'center',
  },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabLabel: { fontSize: 10, color: '#aaa', fontWeight: '500' },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#2979ff', marginTop: 2 },
  fabSpace: { width: 60 },
});

export default MainApp;
