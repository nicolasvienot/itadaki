import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DestinationCard } from "../../src/components/DestinationCard";
import { DestinationCardWithProgress } from "../../src/components/DestinationCardWithProgress";
import { colors, typography } from "../../src/constants/colors";
import { useDestinations } from "../../src/hooks/useDestinations";
import { usePassportStats } from "../../src/hooks/usePassportStats";
import { useAppStore } from "../../src/store/useAppStore";

export default function DiscoverScreen() {
  const router = useRouter();
  const { data: destinations = [] } = useDestinations();
  const activeDestinationId = useAppStore((s) => s.activeDestinationId);
  const { data: stats } = usePassportStats();
  const [query, setQuery] = useState("");

  const progressMap = new Map();
  stats?.destinationProgress.forEach((progress) => {
    progressMap.set(progress.destinationId, progress);
  });

  const trimmed = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!trimmed) return null;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(trimmed) ||
        d.country.toLowerCase().includes(trimmed),
    );
  }, [destinations, trimmed]);

  const currentDestination = destinations.find(
    (d) => d.id === activeDestinationId,
  );
  const inProgress = destinations.filter((d) => {
    const progress = progressMap.get(d.id);
    return d.id !== activeDestinationId && progress && progress.triedCount > 0;
  });
  const newMissions = destinations.filter((d) => {
    const progress = progressMap.get(d.id);
    return (
      d.id !== activeDestinationId && (!progress || progress.triedCount === 0)
    );
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.sub}>Switch cities or set a new mission</Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.search}>
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color={colors.inkMuted}
            />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search cities"
              placeholderTextColor={colors.inkMuted}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color={colors.inkMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search results override the default sections */}
        {matches !== null ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {matches.length === 0
                ? `NO MATCHES FOR "${query.trim()}"`
                : `RESULTS · ${matches.length}`}
            </Text>
            {matches.length > 0 && (
              <View style={styles.grid}>
                {matches.map((dest) => (
                  <View key={dest.id} style={styles.gridItem}>
                    <DestinationCardWithProgress
                      destination={dest}
                      triedCount={progressMap.get(dest.id)?.triedCount ?? 0}
                      totalCount={dest.dishes.length}
                      onPress={() => router.push(`/destination/${dest.id}`)}
                      tile
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {currentDestination && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>NOW EXPLORING</Text>
                <View style={styles.featuredWrap}>
                  <DestinationCard
                    destination={currentDestination}
                    triedCount={
                      progressMap.get(currentDestination.id)?.triedCount ?? 0
                    }
                    onPress={() =>
                      router.push(`/destination/${currentDestination.id}`)
                    }
                    current
                  />
                </View>
              </View>
            )}

            {inProgress.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>IN PROGRESS</Text>
                <View style={styles.rowList}>
                  {inProgress.map((dest) => {
                    const progress = progressMap.get(dest.id);
                    return (
                      <DestinationCardWithProgress
                        key={dest.id}
                        destination={dest}
                        triedCount={progress?.triedCount ?? 0}
                        totalCount={dest.dishes.length}
                        onPress={() => router.push(`/destination/${dest.id}`)}
                      />
                    );
                  })}
                </View>
              </View>
            )}

            {newMissions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>NEW MISSIONS</Text>
                <View style={styles.grid}>
                  {newMissions.map((dest) => (
                    <View key={dest.id} style={styles.gridItem}>
                      <DestinationCardWithProgress
                        destination={dest}
                        triedCount={0}
                        totalCount={dest.dishes.length}
                        onPress={() => router.push(`/destination/${dest.id}`)}
                        tile
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 14,
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 38,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.inkSoft,
    marginTop: 4,
    lineHeight: 21,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 8,
  },
  section: {
    paddingBottom: 22,
  },
  sectionTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  featuredWrap: {
    paddingHorizontal: 16,
  },
  rowList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47.5%",
  },
});
