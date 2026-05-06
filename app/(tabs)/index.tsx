import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DestinationCard } from "../../src/components/DestinationCard";
import { DishCard } from "../../src/components/DishCard";
import { ProgressBar } from "../../src/components/ProgressBar";
import { colors, typography } from "../../src/constants/colors";
import { useDestinationDetail } from "../../src/hooks/useDestinationDetail";
import { useDestinations } from "../../src/hooks/useDestinations";
import { useAppStore } from "../../src/store/useAppStore";

function ActiveDestination({ destinationId }: { destinationId: string }) {
  const router = useRouter();
  const { destination, checks } = useDestinationDetail(destinationId);
  if (!destination) return null;

  const triedCount = Object.keys(checks).length;
  const recentDishes = destination.dishes
    .filter((d) => checks[d.id])
    .slice(-3)
    .reverse();
  const nextDishes = destination.dishes
    .filter((d) => !checks[d.id])
    .slice(0, 3);

  return (
    <View style={styles.section}>
      <DestinationCard
        destination={destination}
        triedCount={triedCount}
        onPress={() => router.push(`/destination/${destination.id}`)}
        large
        fullBleed
      />
      <ProgressBar
        tried={triedCount}
        total={destination.dishes.length}
        label="Progress"
      />

      {nextDishes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Up Next</Text>
          {nextDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              check={checks[dish.id]}
              onPress={() => router.push(`/dish/${destination.id}/${dish.id}`)}
            />
          ))}
        </>
      )}

      {recentDishes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recently Tried</Text>
          {recentDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              check={checks[dish.id]}
              onPress={() => router.push(`/dish/${destination.id}/${dish.id}`)}
            />
          ))}
        </>
      )}
    </View>
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
        <View style={styles.titleRow}>
          <Text style={styles.greeting}>こんにちは</Text>
          <Text style={styles.title}>Your journey</Text>
        </View>

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
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flexGrow: 1, padding: 20, gap: 20, paddingBottom: 110 },
  titleRow: { gap: 2 },
  greeting: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.mutedStone,
    letterSpacing: 1,
  },
  title: { fontFamily: typography.serif, fontSize: 28, color: colors.inkBlack },
  section: { gap: 16 },
  sectionTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyState: { gap: 16 },
  emptyText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.mutedStone,
  },
});
