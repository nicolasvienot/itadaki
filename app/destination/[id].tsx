import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DishCard } from "../../src/components/DishCard";
import { ProgressBar } from "../../src/components/ProgressBar";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { colors, typography } from "../../src/constants/colors";
import { useDestinationDetail } from "../../src/hooks/useDestinationDetail";
import { useAppStore } from "../../src/store/useAppStore";

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { destination, checks, isLoading } = useDestinationDetail(id);
  const activeDestinationId = useAppStore((s) => s.activeDestinationId);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const triedCount = Object.keys(checks).length;
  const isCurrentCity = activeDestinationId === destination?.id;
  const triedDishes = destination?.dishes.filter((d) => checks[d.id]) ?? [];
  const untriedDishes = destination?.dishes.filter((d) => !checks[d.id]) ?? [];

  return (
    <View style={styles.safe}>
      <ScreenHeader title={destination?.name ?? ""} onBack={() => router.back()} />

      {isLoading || !destination ? null : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.meta}>
            <View style={styles.headerRow}>
              <View style={styles.textContent}>
                <Text style={styles.country}>{destination.country}</Text>
                <Text style={styles.desc}>{destination.shortDescription}</Text>
              </View>

              {!isCurrentCity && (
                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => {
                    setActiveDestination(destination.id);
                    router.push("/(tabs)");
                  }}
                >
                  <MaterialCommunityIcons name="star" size={16} color={colors.warmWhite} />
                  <Text style={styles.switchButtonText}>Make current</Text>
                </TouchableOpacity>
              )}

              {isCurrentCity && (
                <View style={styles.currentBadge}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.terracotta} />
                  <Text style={styles.currentBadgeText}>Current city</Text>
                </View>
              )}
            </View>

            <ProgressBar tried={triedCount} total={destination.dishes.length} label="Dishes tried" />
          </View>

          {untriedDishes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Yet to try</Text>
              <View style={styles.list}>
                {untriedDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onPress={() => router.push(`/dish/${destination.id}/${dish.id}`)}
                  />
                ))}
              </View>
            </View>
          )}

          {triedDishes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tried</Text>
              <View style={styles.list}>
                {triedDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    check={checks[dish.id]}
                    onPress={() => router.push(`/dish/${destination.id}/${dish.id}`)}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 24, paddingBottom: 40 },
  meta: { gap: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  textContent: {
    flex: 1,
    gap: 8,
  },
  country: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.terracotta,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  desc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.mutedStone,
    lineHeight: 21,
  },
  switchButton: {
    backgroundColor: colors.terracotta,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: colors.inkBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  switchButtonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.warmWhite,
  },
  currentBadge: {
    backgroundColor: colors.warmWhite,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  currentBadgeText: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.terracotta,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  list: {
    gap: 12,
  },
});
