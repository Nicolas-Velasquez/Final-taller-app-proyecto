import React from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen3Props { onNext: () => void; onSkip: () => void; }

const OnboardingScreen3: React.FC<OnboardingScreen3Props> = ({ onNext, onSkip }) => {
  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#fef9e7" translucent={false} />

      {/* Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Omitir</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.iconCard}>
          <View style={styles.trophy}>
            <View style={styles.cupTop}>
              <View style={styles.cupBody}>
                <View style={styles.cupInner} />
              </View>
              <View style={[styles.handle, styles.handleLeft]} />
              <View style={[styles.handle, styles.handleRight]} />
            </View>
            <View style={styles.stem} />
            <View style={styles.base} />
          </View>
        </View>
        <Text style={styles.title}>Alcanza tus metas de ahorro</Text>
        <Text style={styles.subtitle}>
          Define objetivos, registra abonos y celebra cada logro. Tu futuro empieza hoy.
        </Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>¡Comenzar!  ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: height,
    backgroundColor: '#fef9e7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },
  skipText: { fontSize: 15, color: '#333333', fontWeight: '500' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCard: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    elevation: 4,
  },
  trophy: { alignItems: 'center', justifyContent: 'flex-end' },
  cupTop: { alignItems: 'center', position: 'relative' },
  cupBody: { width: 44, height: 38, backgroundColor: '#f5a623', borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderWidth: 2.5, borderColor: '#222', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cupInner: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#ffc94d', opacity: 0.5 },
  handle: { position: 'absolute', top: 6, width: 12, height: 18, borderWidth: 2.5, borderColor: '#222', borderRadius: 6, backgroundColor: 'transparent' },
  handleLeft: { left: -8, borderRightWidth: 0 },
  handleRight: { right: -8, borderLeftWidth: 0 },
  stem: { width: 10, height: 14, backgroundColor: '#8B5E3C', borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#222', marginTop: -1 },
  base: { width: 40, height: 8, backgroundColor: '#8B5E3C', borderRadius: 3, borderWidth: 2, borderColor: '#222', marginTop: -1 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 12, lineHeight: 30 },
  subtitle: { fontSize: 14, color: '#444444', textAlign: 'center', lineHeight: 22 },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'android' ? 32 : 40,
    alignItems: 'center',
    gap: 20,
  },
  dotsContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f5d98b' },
  dotActive: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#f5a623' },
  nextButton: { backgroundColor: '#f5a623', borderRadius: 14, width: width - 48, paddingVertical: 16, alignItems: 'center' },
  nextButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
});

export default OnboardingScreen3;