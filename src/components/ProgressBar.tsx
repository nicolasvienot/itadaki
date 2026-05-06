import { useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { colors, typography } from '../constants/colors';

interface Props {
  tried: number;
  total: number;
  label?: string;
  height?: number;
  showLabel?: boolean;
  trackColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({
  tried,
  total,
  label,
  height = 8,
  showLabel = true,
  trackColor,
  style,
}: Props) {
  const progress = total > 0 ? tried / total : 0;
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 800, easing: Easing.out(Easing.ease) });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => {
    return { width: `${width.value * 100}%` };
  });

  const pct = Math.round(progress * 100);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, { height, borderRadius: height, backgroundColor: trackColor ?? colors.surfaceAlt }]}>
        <Animated.View style={[styles.fill, { borderRadius: height }, barStyle]} />
      </View>
      {showLabel && (
        <View style={styles.row}>
          <Text style={styles.count}>{tried}/{total} dishes</Text>
          <Text style={styles.count}>{pct}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  track: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.sage,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  count: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.inkSoft,
  },
});
