import { Image } from "expo-image";
import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../constants/colors";
import { PassportStats } from "../types";

interface Props {
  stats: PassportStats;
}

export const PassportShareCard = forwardRef<View, Props>(({ stats }, ref) => {
  const unlockedBadges = stats.badges.filter((b) => b.unlocked);
  const allPhotos = stats.destinationProgress
    .flatMap((d) => d.recentPhotos)
    .slice(0, 4);

  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Itadaki</Text>
        <Text style={styles.subtitle}>Food passport</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{stats.totalDishes}</Text>
          <Text style={styles.statLabel}>Dishes</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{stats.countriesVisited}</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{unlockedBadges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {allPhotos.length > 0 && (
        <View style={styles.photoGrid}>
          {allPhotos.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={styles.photo}
              contentFit="cover"
            />
          ))}
        </View>
      )}

      {unlockedBadges.length > 0 && (
        <View style={styles.badgeRow}>
          {unlockedBadges.map((b) => (
            <Text key={b.id} style={styles.badgeEmoji}>
              {b.emoji}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.footer}>itadaki.app</Text>
    </View>
  );
});

PassportShareCard.displayName = "PassportShareCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cream,
    borderRadius: 24,
    padding: 24,
    width: 320,
    gap: 20,
  },
  header: {
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.terracotta,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.warmWhite,
    borderRadius: 16,
    padding: 16,
    gap: 0,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statNum: {
    fontFamily: typography.serif,
    fontSize: 32,
    color: colors.inkBlack,
  },
  statLabel: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.cardBorder,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  photo: {
    width: 128,
    height: 80,
    borderRadius: 8,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  badgeEmoji: {
    fontSize: 24,
  },
  footer: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.mutedStone,
    textAlign: "center",
    letterSpacing: 1,
  },
});
