import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 36 }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <View style={[styles.star, { width: size, height: size }]}>
            <View
              style={[
                styles.starInner,
                {
                  backgroundColor: star <= value ? colors.dustyGold : 'transparent',
                  borderColor: star <= value ? colors.dustyGold : colors.mutedStone,
                  width: size - 4,
                  height: size - 4,
                  borderRadius: (size - 4) / 2,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starInner: {
    borderWidth: 2,
  },
});
