import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DestinationCard } from "../../src/components/DestinationCard";
import { colors, numStyle, typography } from "../../src/constants/colors";
import { useDestinationDetail } from "../../src/hooks/useDestinationDetail";
import { useDestinations } from "../../src/hooks/useDestinations";
import { usePassportStats } from "../../src/hooks/usePassportStats";
import { useAppStore } from "../../src/store/useAppStore";
import { Dish, DishCheck } from "../../src/types";

function ActiveDestination({ destinationId }: { destinationId: string }) {
  const router = useRouter();
  const { destination, checks } = useDestinationDetail(destinationId);
  const { data: stats } = usePassportStats();
  if (!destination) return null;

  const triedCount = Object.keys(checks).length;
  const total = destination.dishes.length;

  const upNext = destination.dishes.filter((d) => !checks[d.id]).slice(0, 3);
  const unlockedBadges = stats?.badges.filter((b) => b.unlocked).length ?? 0;

  return (
    <>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingEyebrow}>こんにちは · HELLO</Text>
        <View style={styles.titleWrap}>
          <Text style={styles.titleLine1}>Your journey</Text>
          <Text style={styles.titleLine2}>through {destination.name}</Text>
        </View>
      </View>

      {/* Hero card */}
      <View style={styles.heroWrap}>
        <DestinationCard
          destination={destination}
          triedCount={triedCount}
          onPress={() => router.push(`/destination/${destination.id}`)}
          large
          current
        />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatTile icon="fire" value={String(triedCount > 0 ? Math.max(1, triedCount) : 0)} sub="days" label="STREAK" />
        <StatTile icon="silverware-fork-knife" value={String(stats?.totalDishes ?? triedCount)} sub="dishes" label="TRIED" />
        <StatTile icon="star-four-points" value={String(unlockedBadges)} sub="earned" label="BADGES" />
      </View>

      {/* Up Next */}
      {upNext.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>UP NEXT</Text>
            <TouchableOpacity onPress={() => router.push(`/destination/${destination.id}`)}>
              <Text style={styles.sectionLink}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.upNext}>
            {upNext.map((dish) => (
              <UpNextRow
                key={dish.id}
                dish={dish}
                check={checks[dish.id]}
                onPress={() => router.push(`/dish/${destination.id}/${dish.id}`)}
              />
            ))}
          </View>
        </>
      )}
    </>
  );
}

function StatTile({
  icon,
  value,
  sub,
  label,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  value: string;
  sub: string;
  label: string;
}) {
  return (
    <View style={styles.statTile}>
      <MaterialCommunityIcons name={icon} size={14} color={colors.inkMuted} />
      <View style={styles.statValueRow}>
        <Text style={numStyle(22, colors.ink)}>{value}</Text>
        <Text style={styles.statSub}>{sub}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function UpNextRow({
  dish,
  check,
  onPress,
}: {
  dish: Dish;
  check?: DishCheck;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.upNextRow} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: dish.photoUrl }}
        style={styles.upNextThumb}
        contentFit="cover"
      />
      <View style={styles.upNextInfo}>
        <Text style={styles.upNextLocal}>
          {dish.localName} <Text style={styles.upNextLocalEn}>· {dish.name}</Text>
        </Text>
        <Text style={styles.upNextName} numberOfLines={1}>
          {dish.oneLiner || dish.name}
        </Text>
      </View>
      <View style={styles.upNextChevron}>
        <MaterialCommunityIcons name="chevron-right" size={14} color={colors.inkMuted} />
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const activeDestinationId = useAppStore((s) => s.activeDestinationId);
  const { data: destinations = [] } = useDestinations();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeDestinationId ? (
          <ActiveDestination destinationId={activeDestinationId} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Pick a city to start your food passport.
            </Text>
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onPress={() => router.push("/discover")}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  greeting: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 16,
  },
  greetingEyebrow: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  titleWrap: {
    gap: 0,
  },
  titleLine1: {
    fontFamily: typography.serif,
    fontSize: 36,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  titleLine2: {
    fontFamily: typography.serifItalic,
    fontSize: 36,
    color: colors.primary,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  heroWrap: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 22,
  },
  statTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    gap: 4,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  statSub: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.inkMuted,
  },
  statLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 0.6,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
  },
  sectionLink: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.primary,
  },
  upNext: {
    paddingHorizontal: 16,
    gap: 10,
  },
  upNextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  upNextThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
  },
  upNextInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  upNextLocal: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: colors.primary,
  },
  upNextLocalEn: {
    color: colors.inkMuted,
  },
  upNextName: {
    fontFamily: typography.serif,
    fontSize: 18,
    color: colors.ink,
    lineHeight: 20,
  },
  upNextChevron: {
    width: 32,
    height: 32,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.inkSoft,
  },
});
