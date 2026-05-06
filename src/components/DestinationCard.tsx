import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Destination } from '../types';
import { colors, typography } from '../constants/colors';

interface Props {
  destination: Destination;
  triedCount?: number;
  onPress: () => void;
  large?: boolean;
  fullBleed?: boolean;
}

export function DestinationCard({ destination, triedCount, onPress, large = false, fullBleed = false }: Props) {
  const height = large ? 220 : 160;

  return (
    <TouchableOpacity
      style={[styles.card, { height }, fullBleed && styles.fullBleedCard]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image
        source={{ uri: destination.coverPhotoUrl }}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.terracotta }]}
        contentFit="cover"
        transition={400}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        {triedCount != null && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{triedCount}/{destination.dishes.length}</Text>
          </View>
        )}
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.country}>{destination.country}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.terracotta,
    justifyContent: 'flex-end',
  },
  fullBleedCard: {
    borderRadius: 0,
    marginHorizontal: -20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 20, 16, 0.42)',
  },
  content: {
    padding: 18,
    gap: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.sageGreen,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  badgeText: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: '#fff',
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: '#fff',
  },
  country: {
    fontFamily: typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
});
