import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';
import MainApp from '../src/screens/MainApp';
import Onboarding from '../src/screens/Onboarding';
import RegisterScreen from '../src/screens/RegisterScreen';
import { getSession } from '../src/storage/authStorage';

type Screen = 'loading' | 'onboarding' | 'login' | 'register' | 'app';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkInitialScreen();
  }, []);

  const checkInitialScreen = async () => {
    const onboardingDone = await AsyncStorage.getItem('onboarding_done');
    const session = await getSession();
    if (session) {
      setUsername(session);
      setScreen('app');
    } else if (onboardingDone) {
      setScreen('login');
    } else {
      setScreen('onboarding');
    }
  };

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    setScreen('login');
  };

  const handleLoginSuccess = async () => {
    const session = await getSession();
    setUsername(session || 'Usuario');
    setScreen('app');
  };

  if (screen === 'loading') {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#2979ff" /></View>;
  }
  if (screen === 'onboarding') {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }
  if (screen === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} onGoToRegister={() => setScreen('register')} />;
  }
  if (screen === 'register') {
    return <RegisterScreen onRegisterSuccess={() => setScreen('login')} onGoToLogin={() => setScreen('login')} />;
  }
  return <MainApp username={username} onLogout={() => setScreen('login')} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f6ff' },
});