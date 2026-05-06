import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../constants/colors";
import { Dish, DishCheck } from "../types";

interface Props {
  dish: Dish;
  check?: DishCheck;
  onPress: () => void;
}

export function DishCard({ dish, check, onPress }: Props) {
  const tried = !!check;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: dish.photoUrl }}
        style={[
          styles.photo,
          { backgroundColor: colors.surfaceAlt },
          !tried && styles.photoUntried,
        ]}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.info}>
        <Text style={styles.localName} numberOfLines={1}>
          {dish.localName}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {dish.name}
        </Text>
        {dish.oneLiner ? (
          <Text style={styles.oneLiner} numberOfLines={1}>
            {dish.oneLiner}
          </Text>
        ) : null}
        {tried && check?.rating != null && (
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.ratingDot,
                  {
                    backgroundColor:
                      i < (check.rating ?? 0) ? colors.gold : colors.surfaceAlt,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {tried ? (
        <View style={styles.triedBadge}>
          <MaterialCommunityIcons name="check" size={16} color="#fff" />
        </View>
      ) : (
        <View style={styles.untriedBadge}>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.inkMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  photoUntried: {
    opacity: 0.85,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  localName: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: colors.primary,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 17,
    color: colors.ink,
    lineHeight: 20,
  },
  oneLiner: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  ratingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  triedBadge: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  untriedBadge: {
    width: 32,
    height: 32,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
});
