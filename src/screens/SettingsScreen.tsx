import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getSettings, saveSettings, AppSettings } from '../storage/appStorage';
import { logout } from '../storage/authStorage';

const BUDGET_CATEGORIES = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud'];

interface SettingsScreenProps {
  username: string;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ username, onLogout }) => {
  const [settings, setSettings] = useState<AppSettings>({
    tipsEnabled: true,
    notificationsEnabled: true,
    budgetAlertsPerCategory: {},
  });

  const loadData = useCallback(() => {
  const fetchData = async () => {
    const s = await getSettings();
    setSettings(s);
  };
  fetchData();
}, []);

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings(updated);
  };

  const toggleCategoryAlert = async (cat: string) => {
    const updated = {
      ...settings,
      budgetAlertsPerCategory: {
        ...settings.budgetAlertsPerCategory,
        [cat]: !settings.budgetAlertsPerCategory[cat],
      },
    };
    setSettings(updated);
    await saveSettings(updated);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const memberSince = new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  const categoryIcons: Record<string, string> = {
    'Alimentación': 'restaurant-outline',
    'Transporte': 'bus-outline',
    'Entretenimiento': 'film-outline',
    'Salud': 'medkit-outline',
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" translucent={false} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="rgba(255,255,255,0.8)" />
          </View>
          <View>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileSub}>Miembro desde {memberSince}</Text>
          </View>
        </View>

        {/* Notificaciones */}
        <Text style={styles.sectionLabel}>NOTIFICACIONES</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#fff8e1' }]}>
              <Ionicons name="bulb-outline" size={20} color="#f5a623" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Tips financieros diarios</Text>
              <Text style={styles.settingDesc}>Consejos personalizados cada día</Text>
            </View>
            <Switch
              value={settings.tipsEnabled}
              onValueChange={v => updateSetting('tipsEnabled', v)}
              trackColor={{ true: '#2979ff' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#eef3ff' }]}>
              <Ionicons name="notifications-outline" size={20} color="#2979ff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Notificaciones generales</Text>
              <Text style={styles.settingDesc}>Resumen semanal y recordatorios</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={v => updateSetting('notificationsEnabled', v)}
              trackColor={{ true: '#2979ff' }}
            />
          </View>
        </View>

        {/* Alertas de presupuesto */}
        <Text style={styles.sectionLabel}>ALERTAS DE PRESUPUESTO</Text>
        <View style={styles.card}>
          {BUDGET_CATEGORIES.map((cat, i) => (
            <View key={cat}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.settingRow}>
                <View style={[styles.settingIcon, { backgroundColor: '#f5f7fa' }]}>
                  <Ionicons name={categoryIcons[cat] as any} size={20} color="#555" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingTitle}>{cat}</Text>
                  <Text style={styles.settingDesc}>Alerta al 80% y 100%</Text>
                </View>
                <Switch
                  value={!!settings.budgetAlertsPerCategory[cat]}
                  onValueChange={() => toggleCategoryAlert(cat)}
                  trackColor={{ true: '#2979ff' }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#f44336" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f7fa', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  profileCard: { backgroundColor: '#2979ff', margin: 16, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  profileName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  profileSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#999', letterSpacing: 1, marginHorizontal: 16, marginBottom: 8, marginTop: 8 },
  card: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 4, elevation: 1, marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  settingDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f5f7fa', marginHorizontal: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 16, elevation: 1 },
  logoutText: { color: '#f44336', fontSize: 15, fontWeight: '700' },
});

export default SettingsScreen;
