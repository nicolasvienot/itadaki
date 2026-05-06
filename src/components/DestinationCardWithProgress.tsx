import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, typography } from '../constants/colors';
import { Destination } from '../types';

interface Props {
  destination: Destination;
  triedCount: number;
  totalCount: number;
  onPress: () => void;
  isCurrent?: boolean;
  /** Compact 2-col tile for the "New missions" grid */
  tile?: boolean;
}

export function DestinationCardWithProgress({
  destination,
  triedCount,
  totalCount,
  onPress,
  isCurrent = false,
  tile = false,
}: Props) {
  const progress = totalCount > 0 ? (triedCount / totalCount) * 100 : 0;
  const pct = Math.round(progress);

  if (tile) {
    return (
      <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: destination.coverPhotoUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          locations={[0.3, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tileBottom}>
          <Text style={styles.tileName}>{destination.name}</Text>
          <View style={styles.tileMeta}>
            <Text style={styles.tileMetaText}>{destination.country}</Text>
            <Text style={styles.tileMetaText}>{totalCount} dishes</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: destination.coverPhotoUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.2)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.rowContent}>
        <View>
          <Text style={styles.rowCountry}>{destination.country.toUpperCase()}</Text>
          <Text style={styles.rowName}>{destination.name}</Text>
        </View>
        <View>
          <Text style={styles.rowProgress}>
            {triedCount}/{totalCount} · {pct}%
          </Text>
          <View style={styles.rowTrack}>
            <View style={[styles.rowFill, { width: `${progress}%` }]} />
          </View>
          {isCurrent && <Text style={styles.currentTag}>CURRENT CITY</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal row card
  row: {
    height: 160,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  rowContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  rowCountry: {
    fontFamily: typography.bodyBold,
    fontSize: 9,
    color: '#fff',
    opacity: 0.85,
    letterSpacing: 1.4,
  },
  rowName: {
    fontFamily: typography.serif,
    fontSize: 26,
    color: '#fff',
    lineHeight: 28,
    marginTop: 2,
  },
  rowProgress: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: '#fff',
    marginBottom: 6,
  },
  rowTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: 160,
  },
  rowFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  currentTag: {
    fontFamily: typography.bodyBold,
    fontSize: 9,
    color: '#fff',
    letterSpacing: 1.2,
    marginTop: 4,
  },

  // Square tile for grids
  tile: {
    aspectRatio: 1 / 1.05,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  tileBottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  tileName: {
    fontFamily: typography.serif,
    fontSize: 19,
    color: '#fff',
    lineHeight: 21,
  },
  tileMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  tileMetaText: {
    fontFamily: typography.body,
    fontSize: 11,
    color: '#fff',
    opacity: 0.85,
  },
});
