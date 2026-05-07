import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { colors, numStyle, typography } from "../constants/colors";
import { ProgressBar } from "./ProgressBar";

interface Props {
  dishName: string;
  destinationName: string;
  triedCount: number;
  totalCount: number;
  onDone: () => void;
}

/**
 * Full-screen success state shown after a successful check-off.
 * One-time fade-in animation — no loops, no blinking.
 */
export function CheckoffSuccess({
  dishName,
  destinationName,
  triedCount,
  totalCount,
  onDone,
}: Props) {
  const stampOpacity = useSharedValue(0);
  const stampScale = useSharedValue(0.85);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(8);

  useEffect(() => {
    stampOpacity.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
    stampScale.value = withTiming(1, {
      duration: 420,
      easing: Easing.out(Easing.back(1.4)),
    });
    contentOpacity.value = withDelay(
      180,
      withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) })
    );
    contentTranslate.value = withDelay(
      180,
      withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const stampStyle = useAnimatedStyle(() => ({
    opacity: stampOpacity.value,
    transform: [{ rotate: "-8deg" }, { scale: stampScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslate.value }],
  }));

  const remaining = Math.max(0, totalCount - triedCount);

  return (
    <View style={styles.safe}>
      <View style={styles.body}>
        {/* Stamp */}
        <Animated.View style={[styles.stamp, stampStyle]}>
          <View style={styles.stampInner} />
          <Text style={styles.stampWord}>tried</Text>
          <Text style={styles.stampMeta}>
            {destinationName.toUpperCase()} · 2026
          </Text>
        </Animated.View>

        <Animated.View style={[styles.copy, contentStyle]}>
          <Text style={styles.eyebrow}>
            DISH {triedCount} OF {totalCount} · {destinationName.toUpperCase()}
          </Text>
          <Text style={styles.title}>
            {dishName},{" "}
            <Text style={styles.titleEm}>checked.</Text>
          </Text>
          <Text style={styles.sub}>
            {remaining > 0
              ? `One dish closer to a finished passport. ${remaining} more in ${destinationName} to go.`
              : `Every dish in ${destinationName} — done. Time to pick the next city.`}
          </Text>

          {/* Progress card */}
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>
                {destinationName.toUpperCase()}
              </Text>
              <Text style={numStyle(16, colors.ink)}>
                {triedCount}/{totalCount}
              </Text>
            </View>
            <ProgressBar
              tried={triedCount}
              total={totalCount}
              height={8}
              showLabel={false}
              style={{ marginTop: 8 }}
            />
          </View>
        </Animated.View>
      </View>

      {/* Single CTA */}
      <Animated.View style={[styles.ctaWrap, contentStyle]}>
        <TouchableOpacity style={styles.cta} onPress={onDone} activeOpacity={0.9}>
          <Text style={styles.ctaText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const STAMP_SIZE = 168;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    alignItems: "center",
  },
  stamp: {
    width: STAMP_SIZE,
    height: STAMP_SIZE,
    borderRadius: STAMP_SIZE,
    borderWidth: 2.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 36,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 6,
  },
  stampInner: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: STAMP_SIZE,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  stampWord: {
    fontFamily: typography.serifItalic,
    fontSize: 32,
    color: colors.primary,
    lineHeight: 32,
  },
  stampMeta: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.primary,
    marginTop: 8,
  },
  copy: {
    alignItems: "center",
    width: "100%",
  },
  eyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 30,
    color: colors.ink,
    lineHeight: 34,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  titleEm: {
    fontFamily: typography.serifItalic,
    color: colors.primary,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 8,
  },
  progressCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginTop: 28,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  progressLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
  },
  ctaWrap: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: "#fff",
  },
});
