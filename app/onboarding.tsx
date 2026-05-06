import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { DestinationCard } from "../src/components/DestinationCard";
import { Loader } from "../src/components/Loader";
import { colors, typography } from "../src/constants/colors";
import { useDestinations } from "../src/hooks/useDestinations";
import { supabase } from "../src/lib/supabase";
import { useAppStore } from "../src/store/useAppStore";

export default function Onboarding() {
  const router = useRouter();
  const { data: destinations = [], isLoading: catalogLoading } = useDestinations();
  const { setActiveDestination, setOnboardingComplete } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const handlePick = async (destinationId: string) => {
    setIsLoading(true);
    setSelectedDestination(destinationId);
    
    try {
      setActiveDestination(destinationId);
      setOnboardingComplete();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("active_destinations").upsert({
          user_id: user.id,
          destination_id: destinationId,
        });
      }

      router.replace("/(tabs)");
    } catch (error) {
      setIsLoading(false);
      setSelectedDestination(null);
      console.error('Error selecting destination:', error);
    }
  };

  if (catalogLoading || isLoading) {
    const selectedDest = destinations.find(d => d.id === selectedDestination);
    return (
      <Loader text={selectedDest ? `Loading ${selectedDest.name}...` : 'Loading...'} />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Itadaki</Text>
          <Text style={styles.tagline}>Pick your first destination</Text>
          <Text style={styles.sub}>
            You'll get a curated checklist of local dishes to eat your way
            through.
          </Text>
        </View>

        <View style={styles.grid}>
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onPress={() => handlePick(dest.id)}
              large
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  header: {
    gap: 10,
  },
  logo: {
    fontFamily: typography.serif,
    fontSize: 40,
    color: colors.terracotta,
  },
  tagline: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.inkBlack,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.mutedStone,
    lineHeight: 22,
  },
  grid: {
    gap: 16,
  },
});
