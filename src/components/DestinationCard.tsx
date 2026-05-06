import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../constants/colors";
import { Destination } from "../types";

interface Props {
  destination: Destination;
  triedCount?: number;
  onPress: () => void;
  large?: boolean;
  fullBleed?: boolean;
  popular?: boolean;
  /** Show the "CURRENT CITY" suffix on the country line. */
  current?: boolean;
}

export function DestinationCard({
  destination,
  triedCount,
  onPress,
  large = false,
  fullBleed = false,
  popular = false,
  current = false,
}: Props) {
  const height = large ? 240 : 160;
  const total = destination.dishes.length;
  const pct =
    total > 0 && triedCount != null
      ? Math.round((triedCount / total) * 100)
      : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { height }, fullBleed && styles.fullBleedCard]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image
        source={{ uri: destination.coverPhotoUrl }}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.primarySoft },
        ]}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.10)", "rgba(0,0,0,0.7)"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {popular && (
        <View style={styles.popularBadge}>
          <MaterialCommunityIcons name="star" size={11} color={colors.ink} />
          <Text style={styles.popularText}>POPULAR</Text>
        </View>
      )}

      {triedCount != null && (
        <View style={styles.dishChip}>
          <View style={styles.chipCount}>
            <Text style={styles.chipCountText}>{triedCount}</Text>
          </View>
          <Text style={styles.chipText}>of {total} dishes</Text>
        </View>
      )}

      <View style={styles.bottom}>
        <Text style={styles.country}>
          {destination.country.toUpperCase()}
          {current ? " · CURRENT CITY" : ""}
        </Text>
        <Text style={styles.name}>{destination.name}</Text>
        {triedCount != null && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    justifyContent: "flex-end",
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 6,
  },
  fullBleedCard: {
    borderRadius: 0,
    marginHorizontal: -20,
  },
  popularBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  popularText: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    color: colors.ink,
    letterSpacing: 1.2,
  },
  dishChip: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipCount: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chipCountText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: "#fff",
  },
  chipText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.ink,
  },
  bottom: {
    padding: 18,
    gap: 6,
  },
  country: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: "#fff",
    opacity: 0.85,
    letterSpacing: 1.4,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 36,
    color: "#fff",
    lineHeight: 38,
  },
  progressTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.gold,
    borderRadius: 6,
  },
});
