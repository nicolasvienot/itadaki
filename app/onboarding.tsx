import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loader } from "../src/components/Loader";
import { colors, typography } from "../src/constants/colors";
import { useDestinations } from "../src/hooks/useDestinations";
import { supabase } from "../src/lib/supabase";
import { useAppStore } from "../src/store/useAppStore";
import { Destination } from "../src/types";

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
      console.error("Error selecting destination:", error);
    }
  };

  if (catalogLoading || isLoading) {
    const selectedDest = destinations.find((d) => d.id === selectedDestination);
    return (
      <Loader text={selectedDest ? `Loading ${selectedDest.name}...` : "Loading..."} />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>Itadaki</Text>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Pick your first{"\n"}destination</Text>
          <Text style={styles.sub}>
            You'll get a curated checklist of local dishes — eat your way through, photo by photo.
          </Text>
        </View>

        <View style={styles.list}>
          {destinations.map((dest, idx) => (
            <CityCard
              key={dest.id}
              destination={dest}
              popular={idx === 0}
              onPress={() => handlePick(dest.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CityCard({
  destination,
  popular,
  onPress,
}: {
  destination: Destination;
  popular?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <Image
        source={{ uri: destination.coverPhotoUrl }}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.surfaceAlt }]}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.6)"]}
        style={StyleSheet.absoluteFill}
      />

      {popular && (
        <View style={styles.popularBadge}>
          <MaterialCommunityIcons name="star" size={11} color={colors.ink} />
          <Text style={styles.popularText}>POPULAR</Text>
        </View>
      )}

      <View style={styles.dishChip}>
        <Text style={styles.dishChipText}>
          {destination.dishes.length} dishes
        </Text>
      </View>

      <View style={styles.cardBottom}>
        <View style={{ flex: 1 }}>
          <Text style={styles.country}>{destination.country.toUpperCase()}</Text>
          <Text style={styles.name}>{destination.name}</Text>
        </View>
        <View style={styles.arrowBtn}>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.ink} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  brand: {
    fontFamily: typography.serifItalic,
    fontSize: 22,
    color: colors.primary,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
  },
  titleBlock: {
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 20,
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 36,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
    marginTop: 10,
  },
  list: {
    gap: 14,
    paddingTop: 4,
  },
  card: {
    height: 160,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  popularBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  popularText: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    color: colors.ink,
    letterSpacing: 1.2,
  },
  dishChip: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dishChipText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.ink,
  },
  cardBottom: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  country: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: "#fff",
    opacity: 0.85,
    letterSpacing: 1.4,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 30,
    color: "#fff",
    lineHeight: 32,
    marginTop: 2,
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 38,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
