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
      <View style={styles.photoWrap}>
        <Image
          source={{ uri: dish.photoUrl }}
          style={[styles.photo, { backgroundColor: colors.mutedStone }]}
          contentFit="cover"
          transition={300}
        />
        {tried && <View style={styles.triedOverlay} />}
        {tried && (
          <View style={styles.stampBadge}>
            <Text style={styles.stampCheck}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {dish.name}
        </Text>
        <Text style={styles.localName} numberOfLines={1}>
          {dish.localName}
        </Text>
        {tried && check?.rating != null && (
          <View style={styles.ratingRow}>
            {Array.from({ length: check.rating }).map((_, i) => (
              <View key={i} style={styles.starDot} />
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.warmWhite,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  photoWrap: {
    width: 96,
    height: 96,
  },
  photo: {
    width: 96,
    height: 96,
  },
  triedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(122, 140, 110, 0.35)",
  },
  stampBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.sageGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  stampCheck: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
    gap: 2,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 15,
    color: colors.inkBlack,
  },
  localName: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.mutedStone,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  starDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.dustyGold,
  },
});
