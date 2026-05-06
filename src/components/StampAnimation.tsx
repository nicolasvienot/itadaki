import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';

interface Props {
  visible: boolean;
  size?: number;
}

export function StampAnimation({ visible, size = 120 }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 4, stiffness: 300 }),
        withSpring(1.0, { damping: 12, stiffness: 200 })
      );
      opacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
      rippleScale.value = withDelay(100, withTiming(2.5, { duration: 500, easing: Easing.out(Easing.ease) }));
      rippleOpacity.value = withDelay(100, withSequence(
        withTiming(0.4, { duration: 50 }),
        withTiming(0, { duration: 450 })
      ));
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      rippleScale.value = 0;
      rippleOpacity.value = 0;
    }
  }, [visible]);

  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.ripple,
          { width: size, height: size, borderRadius: size / 2 },
          rippleStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.stamp,
          { width: size, height: size, borderRadius: size / 4 },
          stampStyle,
        ]}
      >
        <Animated.Text style={[styles.check, { fontSize: size * 0.45 }]}>✓</Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  stamp: {
    position: 'absolute',
    backgroundColor: colors.sageGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  ripple: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.sageGreen,
  },
  check: {
    color: '#fff',
    fontWeight: '700',
  },
});
