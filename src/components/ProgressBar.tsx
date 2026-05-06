import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { colors, typography } from '../constants/colors';

interface Props {
  tried: number;
  total: number;
  label?: string;
}

export function ProgressBar({ tried, total, label }: Props) {
  const progress = total > 0 ? tried / total : 0;
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 800, easing: Easing.out(Easing.ease) });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => {
    if (width.value === 0) {
      return { width: 0 };
    }
    return { 
      flex: width.value,
      borderTopRightRadius: width.value >= 1 ? 3 : 0,
      borderBottomRightRadius: width.value >= 1 ? 3 : 0,
    };
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
        {progress < 1 && <View style={{ flex: 1 - progress }} />}
      </View>
      <Text style={styles.count}>{tried}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.mutedStone,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cardBorder,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.sageGreen,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  count: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.mutedStone,
  },
});
