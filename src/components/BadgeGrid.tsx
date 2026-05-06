import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../types';
import { colors, typography } from '../constants/colors';

interface Props {
  badges: Array<Badge & { unlocked: boolean }>;
}

export function BadgeGrid({ badges }: Props) {
  return (
    <View style={styles.grid}>
      {badges.map((badge) => (
        <View
          key={badge.id}
          style={[styles.item, !badge.unlocked && styles.locked]}
        >
          <Text style={[styles.emoji, !badge.unlocked && styles.lockedEmoji]}>
            {badge.unlocked ? badge.emoji : '🔒'}
          </Text>
          <Text style={[styles.name, !badge.unlocked && styles.lockedText]} numberOfLines={1}>
            {badge.name}
          </Text>
          <Text style={[styles.desc, !badge.unlocked && styles.lockedText]} numberOfLines={2}>
            {badge.description}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  item: {
    width: '30%',
    backgroundColor: colors.warmWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    gap: 2,
    alignItems: 'center',
    minHeight: 90,
  },
  locked: {
    opacity: 0.45,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  lockedEmoji: {
    fontSize: 20,
  },
  name: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: colors.inkBlack,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.mutedStone,
  },
  desc: {
    fontFamily: typography.body,
    fontSize: 9,
    color: colors.mutedStone,
    lineHeight: 12,
    textAlign: 'center',
  },
});
