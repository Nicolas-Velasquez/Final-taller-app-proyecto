import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ onNext, onSkip }) => {
  // Ignora completamente el color scheme del sistema
  const colorScheme = 'light'; // forzado, no usa useColorScheme()
  const bgColor = '#dce8f8';
  return (
    <View style={[styles.wrapper, { backgroundColor: '#dce8f8' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#dce8f8" translucent={false} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Omitir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.iconCard}>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBorder}>
                <View style={styles.barsContainer}>
                  <View style={[styles.bar, styles.barGreen, { height: 36 }]} />
                  <View style={[styles.bar, styles.barRed,   { height: 52 }]} />
                  <View style={[styles.bar, styles.barBlue,  { height: 44 }]} />
                  <View style={[styles.bar, styles.barGray,  { height: 28 }]} />
                </View>
                <View style={styles.chartBaseline} />
              </View>
            </View>
          </View>
          <Text style={styles.title}>Control total de tus finanzas</Text>
          <Text style={styles.subtitle}>
            Registra ingresos y gastos en segundos. Sin complicaciones, sin internet necesario.
          </Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>Siguiente  ›</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#dce8f8' },
  container: { flex: 1, backgroundColor: '#dce8f8' },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 16 : 8, alignItems: 'flex-end' },
  skipText: { fontSize: 15, color: '#333333', fontWeight: '500' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconCard: { width: 120, height: 120, backgroundColor: '#ffffff', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 40, elevation: 4 },
  chartWrapper: { padding: 4 },
  chartBorder: { width: 64, height: 56, borderWidth: 2, borderColor: '#222', borderRadius: 2, justifyContent: 'flex-end', padding: 4, paddingBottom: 0, overflow: 'hidden', backgroundColor: '#ffffff' },
  barsContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, flex: 1, paddingBottom: 4 },
  bar: { flex: 1, borderRadius: 1 },
  barGreen: { backgroundColor: '#4caf50' },
  barRed: { backgroundColor: '#f44336' },
  barBlue: { backgroundColor: '#2196f3' },
  barGray: { backgroundColor: '#9e9e9e' },
  chartBaseline: { height: 2, backgroundColor: '#222', marginHorizontal: -4 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 12, lineHeight: 30 },
  subtitle: { fontSize: 14, color: '#444444', textAlign: 'center', lineHeight: 22 },
  bottom: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'android' ? 24 : 32, alignItems: 'center', gap: 20 },
  dotsContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#b0c8e8' },
  dotActive: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#2979ff' },
  nextButton: { backgroundColor: '#2979ff', borderRadius: 14, width: width - 48, paddingVertical: 16, alignItems: 'center', marginBottom: Platform.OS === 'android' ? 8 : 0 },
  nextButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
});

export default OnboardingScreen1;