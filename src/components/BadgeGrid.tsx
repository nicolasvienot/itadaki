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
          style={[styles.item, !badge.unlocked && styles.itemLocked]}
        >
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: badge.unlocked ? colors.primary : colors.surfaceAlt,
                borderWidth: badge.unlocked ? 0 : 1.5,
                borderColor: colors.inkMuted,
                borderStyle: 'dashed',
              },
            ]}
          >
            <Text style={[styles.emoji, badge.unlocked ? styles.emojiActive : null]}>
              {badge.unlocked ? badge.emoji : '🔒'}
            </Text>
          </View>
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
    gap: 10,
  },
  item: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 4,
    alignItems: 'center',
  },
  itemLocked: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.7,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 18,
  },
  emojiActive: {
    color: '#fff',
  },
  name: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 14,
  },
  desc: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 12,
  },
  lockedText: {
    color: colors.inkMuted,
  },
});
