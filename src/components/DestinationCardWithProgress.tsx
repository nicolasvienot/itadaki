import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography } from '../constants/colors';
import { Destination } from '../types';

interface Props {
  destination: Destination;
  triedCount: number;
  totalCount: number;
  onPress: () => void;
  isCurrent?: boolean;
}

export function DestinationCardWithProgress({
  destination,
  triedCount,
  totalCount,
  onPress,
  isCurrent = false,
}: Props) {
  const progress = totalCount > 0 ? (triedCount / totalCount) * 100 : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: destination.coverPhotoUrl }} style={styles.image} contentFit="cover" />
      
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={styles.name}>{destination.name}</Text>
            <Text style={styles.country}>{destination.country}</Text>
          </View>
          
          {isCurrent && (
            <View style={styles.currentBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={colors.terracotta} />
              <Text style={styles.currentText}>Current</Text>
            </View>
          )}
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {triedCount}/{totalCount} dishes
            </Text>
            <Text style={styles.percentage}>
              {totalCount > 0 ? Math.round(progress) : 0}%
            </Text>
          </View>
          
          <View style={styles.progressTrack}>
            {triedCount > 0 && (
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    backgroundColor: colors.inkBlack,
    shadowColor: colors.inkBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 24,
    color: colors.warmWhite,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  country: {
    fontFamily: typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  currentBadge: {
    backgroundColor: colors.warmWhite,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  currentText: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    color: colors.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressSection: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.warmWhite,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  percentage: {
    fontFamily: typography.serif,
    fontSize: 16,
    color: colors.warmWhite,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.warmWhite,
    borderRadius: 3,
  },
});