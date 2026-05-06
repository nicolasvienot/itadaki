import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 28, readOnly }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const Wrapper: any = readOnly || !onChange ? View : TouchableOpacity;
        return (
          <Wrapper
            key={star}
            onPress={onChange ? () => onChange(star) : undefined}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? colors.gold : colors.inkMuted}
            />
          </Wrapper>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
