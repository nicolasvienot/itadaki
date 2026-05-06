import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../../../src/constants/colors";
import { useDestinationDetail } from "../../../src/hooks/useDestinationDetail";
import { Loader } from "../../../src/components/Loader";
import { ScreenHeader } from "../../../src/components/ScreenHeader";

export default function DishDetailScreen() {
  const { destinationId, dishId } = useLocalSearchParams<{
    destinationId: string;
    dishId: string;
  }>();
  const router = useRouter();
  const { destination, checks, isLoading } = useDestinationDetail(destinationId);
  const dish = destination?.dishes.find((d) => d.id === dishId);
  const check = checks[dishId];

  if (isLoading) {
    return <Loader />;
  }

  if (!dish) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Dish not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safe}>
      <Image
        source={{ uri: dish.photoUrl }}
        style={[styles.hero, { backgroundColor: colors.terracotta }]}
        contentFit="cover"
        transition={400}
      />
      <View style={styles.heroOverlay} />

      <ScreenHeader onBack={() => router.back()} overlay />

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.handle} />

        <Text style={styles.localName}>{dish.localName}</Text>
        <Text style={styles.name}>{dish.name}</Text>
        <Text style={styles.oneLiner}>{dish.oneLiner}</Text>

        {dish.funFact && (
          <View style={styles.funFactCard}>
            <Text style={styles.funFactLabel}>Did you know?</Text>
            <Text style={styles.funFact}>{dish.funFact}</Text>
          </View>
        )}

        {check ? (
          <View style={styles.checkedState}>
            <Text style={styles.checkedLabel}>✓ You tried this!</Text>
            {check.rating != null && (
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.starDot,
                      {
                        backgroundColor:
                          i < check.rating!
                            ? colors.dustyGold
                            : colors.cardBorder,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
            {check.note && <Text style={styles.note}>"{check.note}"</Text>}
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() =>
                router.push(`/capture/${dishId}?destinationId=${destinationId}`)
              }
            >
              <Text style={styles.retryBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() =>
              router.push(`/capture/${dishId}?destinationId=${destinationId}`)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Mark as tried</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.inkBlack },
  hero: { position: "absolute", top: 0, left: 0, right: 0, height: "55%" },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: "rgba(26,20,16,0.25)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: "45%",
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetContent: { padding: 24, gap: 16, paddingBottom: 48 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    alignSelf: "center",
    marginBottom: 8,
  },
  localName: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.terracotta,
    letterSpacing: 0.5,
  },
  name: { fontFamily: typography.serif, fontSize: 26, color: colors.inkBlack },
  oneLiner: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.mutedStone,
    lineHeight: 23,
  },
  funFactCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 6,
  },
  funFactLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: colors.terracotta,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  funFact: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkBlack,
    lineHeight: 20,
  },
  checkedState: {
    backgroundColor: colors.warmWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.sageGreen,
    padding: 18,
    gap: 10,
    alignItems: "flex-start",
  },
  checkedLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.sageGreen,
  },
  ratingRow: { flexDirection: "row", gap: 6 },
  starDot: { width: 10, height: 10, borderRadius: 5 },
  note: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.mutedStone,
    fontStyle: "italic",
  },
  retryBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  retryBtnText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.mutedStone,
  },
  ctaBtn: {
    backgroundColor: colors.terracotta,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaBtnText: {
    fontFamily: typography.bodyMedium,
    fontSize: 16,
    color: "#fff",
  },
  notFound: {
    fontFamily: typography.body,
    color: colors.mutedStone,
    padding: 40,
  },
});
