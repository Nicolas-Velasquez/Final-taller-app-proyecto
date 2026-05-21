import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ onNext, onSkip }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e8f5e9" />

      {/* Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Omitir</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Icon card */}
        <View style={styles.iconCard}>
          {/* Target / dart icon built with Views */}
          <View style={styles.target}>
            {/* Outer red ring */}
            <View style={styles.ringOuter}>
              {/* White ring */}
              <View style={styles.ringWhite}>
                {/* Inner red circle */}
                <View style={styles.ringInner} />
              </View>
            </View>
            {/* Dart overlay */}
            <View style={styles.dartContainer}>
              <View style={styles.dartBody} />
              <View style={styles.dartTip} />
              <View style={styles.dartFlight} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Presupuestos inteligentes</Text>
        <Text style={styles.subtitle}>
          Crea límites por categoría y recibe alertas antes de sobrepasarlos. Gasta con consciencia.
        </Text>
      </View>

      {/* Bottom section */}
      <View style={styles.bottom}>
        {/* Pagination dots */}
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        {/* Next button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Siguiente  ›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '400',
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  // --- Target icon ---
  target: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e53935',
    borderWidth: 3,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWhite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e53935',
    borderWidth: 2,
    borderColor: '#222',
  },
  dartContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  dartBody: {
    width: 6,
    height: 22,
    backgroundColor: '#29b6f6',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#0288d1',
  },
  dartTip: {
    position: 'absolute',
    bottom: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#0288d1',
  },
  dartFlight: {
    position: 'absolute',
    top: -2,
    width: 14,
    height: 8,
    backgroundColor: '#29b6f6',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#0288d1',
  },
  // --- Text ---
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  // --- Bottom ---
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a5d6a7',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#43a047',
  },
  nextButton: {
    backgroundColor: '#43a047',
    borderRadius: 14,
    width: width - 48,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default OnboardingScreen2;
