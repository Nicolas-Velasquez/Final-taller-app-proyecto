import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';

const { height } = Dimensions.get('window');

interface OnboardingProps {
  onFinish: () => void; // called on skip (any screen) or ¡Comenzar!
}

const SCREENS = [OnboardingScreen1, OnboardingScreen2, OnboardingScreen3];

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animated values for current screen
  const currentTranslateY = useRef(new Animated.Value(0)).current;
  const currentOpacity = useRef(new Animated.Value(1)).current;
  // Animated values for incoming screen
  const nextTranslateY = useRef(new Animated.Value(height * 0.15)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  const animateToNext = (targetIndex: number, onComplete?: () => void) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setNextIndex(targetIndex);

    nextTranslateY.setValue(height * 0.15);
    nextOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(currentTranslateY, {
        toValue: -height * 0.15,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(currentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextTranslateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      currentTranslateY.setValue(0);
      currentOpacity.setValue(1);
      setCurrentIndex(targetIndex);
      setNextIndex(null);
      setIsAnimating(false);
      onComplete?.();
    });
  };

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next >= SCREENS.length) {
      // Last screen → finish onboarding
      onFinish();
    } else {
      animateToNext(next);
    }
  };

  // Skip: animate to last screen briefly then call onFinish,
  // OR just call onFinish directly (instant exit). 
  // Using instant exit feels more intentional for "skip".
  const handleSkip = () => {
    onFinish();
  };

  const CurrentScreen = SCREENS[currentIndex];
  const NextScreen = nextIndex !== null ? SCREENS[nextIndex] : null;

  return (
    <View style={styles.container}>
      {/* Next screen (behind, animates in) */}
      {NextScreen && (
        <Animated.View
          style={[
            styles.screenWrapper,
            {
              opacity: nextOpacity,
              transform: [{ translateY: nextTranslateY }],
            },
          ]}
          pointerEvents="none"
        >
          {/* Props don't matter here — it's just a visual layer */}
          <NextScreen onNext={() => {}} onSkip={() => {}} />
        </Animated.View>
      )}

      {/* Current screen (on top, animates out) */}
      <Animated.View
        style={[
          styles.screenWrapper,
          {
            opacity: currentOpacity,
            transform: [{ translateY: currentTranslateY }],
          },
        ]}
        pointerEvents={isAnimating ? 'none' : 'auto'}
      >
        <CurrentScreen onNext={handleNext} onSkip={handleSkip} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Onboarding;
