import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DestinationCardWithProgress } from "../../src/components/DestinationCardWithProgress";
import { colors, typography } from "../../src/constants/colors";
import { useDestinations } from "../../src/hooks/useDestinations";
import { useAppStore } from "../../src/store/useAppStore";
import { usePassportStats } from "../../src/hooks/usePassportStats";

export default function DiscoverScreen() {
  const router = useRouter();
  const { data: destinations = [] } = useDestinations();
  const activeDestinationId = useAppStore((s) => s.activeDestinationId);
  const { data: stats } = usePassportStats();

  const progressMap = new Map();
  stats?.destinationProgress.forEach((progress) => {
    progressMap.set(progress.destinationId, progress);
  });

  const currentDestination = destinations.find((d) => d.id === activeDestinationId);
  const discoveredDestinations = destinations.filter((d) => {
    const progress = progressMap.get(d.id);
    return d.id !== activeDestinationId && progress && progress.triedCount > 0;
  });
  const otherDestinations = destinations.filter((d) => {
    const progress = progressMap.get(d.id);
    return d.id !== activeDestinationId && (!progress || progress.triedCount === 0);
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.sub}>
            {currentDestination 
              ? "Switch cities or explore new destinations." 
              : "Choose a city. Eat your way through it."}
          </Text>
        </View>

        {currentDestination && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current City</Text>
            <DestinationCardWithProgress
              destination={currentDestination}
              triedCount={progressMap.get(currentDestination.id)?.triedCount || 0}
              totalCount={currentDestination.dishes.length}
              onPress={() => router.push(`/destination/${currentDestination.id}`)}
              isCurrent={true}
            />
          </View>
        )}

        {discoveredDestinations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Discovered Cities</Text>
            <View style={styles.grid}>
              {discoveredDestinations.map((dest) => {
                const progress = progressMap.get(dest.id);
                return (
                  <DestinationCardWithProgress
                    key={dest.id}
                    destination={dest}
                    triedCount={progress?.triedCount || 0}
                    totalCount={dest.dishes.length}
                    onPress={() => router.push(`/destination/${dest.id}`)}
                  />
                );
              })}
            </View>
          </View>
        )}

        {otherDestinations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Cities</Text>
            <View style={styles.grid}>
              {otherDestinations.map((dest) => (
                <DestinationCardWithProgress
                  key={dest.id}
                  destination={dest}
                  triedCount={0}
                  totalCount={dest.dishes.length}
                  onPress={() => router.push(`/destination/${dest.id}`)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flexGrow: 1, padding: 20, gap: 32, paddingBottom: 110 },
  header: { gap: 6 },
  title: { fontFamily: typography.serif, fontSize: 28, color: colors.inkBlack },
  sub: { fontFamily: typography.body, fontSize: 14, color: colors.mutedStone },
  section: { gap: 16 },
  sectionTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grid: { gap: 16 },
});
