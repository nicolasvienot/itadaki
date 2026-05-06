import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DishCard } from "../../src/components/DishCard";
import { ProgressBar } from "../../src/components/ProgressBar";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { Skeleton } from "../../src/components/Skeleton";
import { colors, numStyle, typography } from "../../src/constants/colors";
import { useDestinationDetail } from "../../src/hooks/useDestinationDetail";
import { useAppStore } from "../../src/store/useAppStore";

type Filter = "all" | "untried" | "tried";

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { destination, checks, isLoading } = useDestinationDetail(id);
  const activeDestinationId = useAppStore((s) => s.activeDestinationId);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const [filter, setFilter] = useState<Filter>("all");

  const triedCount = Object.keys(checks).length;
  const isCurrentCity = activeDestinationId === destination?.id;
  const total = destination?.dishes.length ?? 0;
  const triedDishes = destination?.dishes.filter((d) => checks[d.id]) ?? [];
  const untriedDishes = destination?.dishes.filter((d) => !checks[d.id]) ?? [];
  const pct = total > 0 ? Math.round((triedCount / total) * 100) : 0;

  if (isLoading || !destination) return <DestinationDetailSkeleton onBack={() => router.back()} />;

  const allOrdered = [...triedDishes, ...untriedDishes];
  const visibleDishes =
    filter === "all"
      ? allOrdered
      : filter === "tried"
      ? triedDishes
      : untriedDishes;

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={{ uri: destination.coverPhotoUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.5)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              colors.bg,
            ]}
            locations={[0, 0.3, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <ScreenHeader onBack={() => router.back()} overlay />
          <View style={styles.heroTitle}>
            <Text style={styles.heroEyebrow}>{destination.country.toUpperCase()}</Text>
            <Text style={styles.heroName}>{destination.name}</Text>
          </View>
        </View>

        {/* Progress card overlapping */}
        <View style={styles.progressWrap}>
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.progressLabel}>YOUR PROGRESS</Text>
                <Text style={[numStyle(26, colors.ink), { marginTop: 2 }]}>
                  {triedCount} of {total} dishes
                </Text>
              </View>
              <Text style={numStyle(26, colors.primary)}>{pct}%</Text>
            </View>
            <ProgressBar
              tried={triedCount}
              total={total}
              height={8}
              showLabel={false}
              style={{ marginTop: 10 }}
            />

            {!isCurrentCity ? (
              <TouchableOpacity
                style={styles.makeCurrent}
                onPress={() => {
                  setActiveDestination(destination.id);
                  router.push("/(tabs)");
                }}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="star" size={14} color="#fff" />
                <Text style={styles.makeCurrentText}>Make this my current city</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.unlockHint}>
                <MaterialCommunityIcons name="star" size={12} color={colors.primary} />
                <Text style={styles.unlockHintText}>
                  {Math.max(0, total - triedCount)} dishes left to unlock{" "}
                  <Text style={styles.unlockHintBold}>Passport stamp</Text>
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {destination.shortDescription ? (
          <View style={styles.descWrap}>
            <Text style={styles.desc}>{destination.shortDescription}</Text>
          </View>
        ) : null}

        {/* Filter pills */}
        <View style={styles.tabs}>
          <FilterPill
            label={`All · ${total}`}
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <FilterPill
            label={`To try · ${untriedDishes.length}`}
            active={filter === "untried"}
            onPress={() => setFilter("untried")}
          />
          <FilterPill
            label={`Tried · ${triedDishes.length}`}
            active={filter === "tried"}
            onPress={() => setFilter("tried")}
          />
        </View>

        {/* Dish list */}
        <View style={styles.list}>
          {visibleDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              check={checks[dish.id]}
              onPress={() => router.push(`/dish/${destination.id}/${dish.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function DestinationDetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.safe}>
      <View style={styles.hero}>
        <Skeleton width="100%" height={280} radius={0} style={StyleSheet.absoluteFillObject} />
        <ScreenHeader onBack={onBack} overlay />
      </View>
      <View style={styles.progressWrap}>
        <View style={styles.progressCard}>
          <Skeleton width={140} height={11} radius={4} />
          <View style={{ height: 8 }} />
          <Skeleton width={180} height={26} radius={6} />
          <View style={{ height: 12 }} />
          <Skeleton width="100%" height={8} radius={8} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, paddingTop: 24, gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={skelStyles.row}>
            <Skeleton width={70} height={70} radius={14} />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width={80} height={11} radius={4} />
              <Skeleton width="70%" height={18} radius={6} />
              <Skeleton width="55%" height={12} radius={4} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const skelStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  hero: {
    height: 280,
    position: "relative",
  },
  heroTitle: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 50,
  },
  heroEyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: "#fff",
    opacity: 0.9,
    letterSpacing: 1.4,
  },
  heroName: {
    fontFamily: typography.serif,
    fontSize: 44,
    color: "#fff",
    lineHeight: 46,
    marginTop: 4,
  },
  progressWrap: {
    paddingHorizontal: 16,
    marginTop: -36,
    zIndex: 2,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 6,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  progressLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
  },
  unlockHint: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unlockHintText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
  unlockHintBold: {
    fontFamily: typography.bodySemiBold,
    color: colors.ink,
  },
  makeCurrent: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  makeCurrentText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: "#fff",
  },
  descWrap: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  desc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  pillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pillText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.inkSoft,
  },
  pillTextActive: {
    color: colors.bg,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
