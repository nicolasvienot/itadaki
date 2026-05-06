import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, numStyle, typography } from "../constants/colors";
import { PassportStats } from "../types";

interface Props {
  stats: PassportStats;
  ownerName?: string;
}

export const PassportShareCard = forwardRef<View, Props>(({ stats, ownerName = 'You' }, ref) => {
  const unlockedBadges = stats.badges.filter((b) => b.unlocked);
  const cities = stats.destinationProgress.slice(0, 4);
  while (cities.length < 4) cities.push(undefined as any);

  return (
    <View ref={ref} collapsable={false} style={styles.wrap}>
      <View style={styles.card}>
        {/* Stamp */}
        <View style={styles.stamp}>
          <Text style={styles.stampWord}>foodie</Text>
          <Text style={styles.stampYear}>2026</Text>
        </View>

        <Text style={styles.eyebrow}>FOOD PASSPORT</Text>
        <Text style={styles.brand}>Itadaki</Text>

        <Text style={styles.issuedLabel}>Issued to</Text>
        <Text style={styles.issuedName}>{ownerName}</Text>

        <View style={styles.statsRow}>
          {[
            { num: stats.totalDishes, label: 'Dishes' },
            { num: stats.countriesVisited, label: 'Cities' },
            { num: unlockedBadges.length, label: 'Stamps' },
          ].map((s, i, arr) => (
            <View key={s.label} style={styles.statWrap}>
              <View style={styles.stat}>
                <Text style={numStyle(30)}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.miniGrid}>
          {cities.map((c, i) => (
            <View
              key={i}
              style={[
                styles.miniStamp,
                c
                  ? { borderColor: colors.primary, borderStyle: 'solid' }
                  : { borderColor: colors.border, borderStyle: 'dashed' },
              ]}
            >
              <Text
                style={[
                  styles.miniStampText,
                  { color: c ? colors.primary : colors.inkMuted },
                ]}
              >
                {c ? c.name : '?'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>itadaki.app</Text>
          <Text style={styles.footerText}>NV-0042 · MAY 2026</Text>
        </View>
      </View>
    </View>
  );
});

PassportShareCard.displayName = "PassportShareCard";

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.ink,
    padding: 24,
  },
  card: {
    backgroundColor: colors.bg,
    borderRadius: 24,
    padding: 24,
    paddingTop: 28,
  },
  stamp: {
    position: 'absolute',
    top: 22,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 64,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-10deg' }],
    opacity: 0.85,
  },
  stampWord: {
    fontFamily: typography.serifItalic,
    fontSize: 14,
    color: colors.primary,
    lineHeight: 14,
  },
  stampYear: {
    fontFamily: typography.bodyBold,
    fontSize: 8,
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 2,
  },
  eyebrow: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    color: colors.inkSoft,
    letterSpacing: 1.6,
  },
  brand: {
    fontFamily: typography.serifItalic,
    fontSize: 36,
    color: colors.primary,
    marginTop: 8,
    lineHeight: 36,
  },
  issuedLabel: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 24,
  },
  issuedName: {
    fontFamily: typography.serif,
    fontSize: 24,
    color: colors.ink,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  statWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stat: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  statLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 10,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    marginTop: 6,
  },
  miniGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 22,
  },
  miniStamp: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStampText: {
    fontFamily: typography.serifItalic,
    fontSize: 11,
  },
  footer: {
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.inkMuted,
  },
});
