import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Dimensions, Platform,
  ActivityIndicator, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { loginUser } from '../storage/authStorage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    const result = await loginUser(username.trim(), password);
    setLoading(false);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" translucent={false} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo / título */}
          <View style={styles.topSection}>
            <View style={styles.logoCard}>
              <Text style={styles.logoText}>"AQUI VAL LOGO MANITO"</Text>
            </View>
            <Text style={styles.appName}>NetCash</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Usuario */}
            <Text style={styles.label}>Usuario</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre de usuario"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Tu contraseña"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Botón login */}
            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              }
            </TouchableOpacity>

            {/* Ir a registro */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={onGoToRegister}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: height,
    backgroundColor: '#f0f6ff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCard: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 16,
  },
  logoText: { fontSize: 36 },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    paddingHorizontal: 14,
  },
  input: {
    height: 48,
    fontSize: 15,
    color: '#1a1a2e',
    flex: 1,
  },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 18 },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2979ff',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  registerText: { fontSize: 14, color: '#666' },
  registerLink: { fontSize: 14, color: '#2979ff', fontWeight: '700' },
});

export default LoginScreen;
