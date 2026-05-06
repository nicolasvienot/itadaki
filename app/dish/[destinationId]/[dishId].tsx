import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "../../../src/components/ScreenHeader";
import { Skeleton } from "../../../src/components/Skeleton";
import { StarRating } from "../../../src/components/StarRating";
import { colors, typography } from "../../../src/constants/colors";
import { useDestinationDetail } from "../../../src/hooks/useDestinationDetail";

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
    return <DishDetailSkeleton onBack={() => router.back()} />;
  }

  if (!dish || !destination) {
    return (
      <View style={styles.safe}>
        <Text style={styles.notFound}>Dish not found.</Text>
      </View>
    );
  }

  const dishIndex = destination.dishes.findIndex((d) => d.id === dish.id) + 1;
  const totalDishes = destination.dishes.length;

  return (
    <View style={styles.safe}>
      {/* Hero photo */}
      <View style={styles.hero}>
        <Image
          source={{ uri: dish.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={400}
        />
        <ScreenHeader onBack={() => router.back()} overlay />
      </View>

      {/* Sheet */}
      <View style={styles.sheet}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.bg]}
          locations={[0, 0.6]}
          style={styles.sheetTopFade}
          pointerEvents="none"
        />
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.handle} />

          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>
              {destination.name.toUpperCase()} · DISH {dishIndex} OF {totalDishes}
            </Text>
            {check && (
              <View style={styles.localFave}>
                <Text style={styles.localFaveText}>★ Tried</Text>
              </View>
            )}
          </View>

          <Text style={styles.localName}>
            {dish.localName} <Text style={styles.localNameEn}>· {dish.name}</Text>
          </Text>
          <Text style={styles.name}>{dish.name}</Text>
          <Text style={styles.oneLiner}>{dish.oneLiner}</Text>

          {dish.funFact ? (
            <View style={styles.factCard}>
              <Text style={styles.factLabel}>DID YOU KNOW</Text>
              <Text style={styles.factBody}>{dish.funFact}</Text>
            </View>
          ) : null}

          {check && (
            <View style={styles.checkCard}>
              <Text style={styles.checkTitle}>You tried this</Text>
              {check.rating != null && (
                <View style={{ marginTop: 8 }}>
                  <StarRating value={check.rating} readOnly size={20} />
                </View>
              )}
              {check.note ? <Text style={styles.checkNote}>"{check.note}"</Text> : null}
            </View>
          )}
        </ScrollView>

        {/* Sticky CTA */}
        <View style={styles.ctaWrap} pointerEvents="box-none">
          <LinearGradient
            colors={["rgba(245,239,224,0)", colors.bg]}
            locations={[0, 0.4]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.9}
            onPress={() =>
              router.push(`/capture/${dishId}?destinationId=${destinationId}`)
            }
          >
            <Text style={styles.ctaText}>{check ? "Edit check-off" : "Mark as tried"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function DishDetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.safe}>
      <View style={styles.hero}>
        <Skeleton width="100%" height={380} radius={0} style={StyleSheet.absoluteFillObject} />
        <ScreenHeader onBack={onBack} overlay />
      </View>
      <View style={styles.sheet}>
        <View style={{ paddingHorizontal: 24, paddingTop: 14, gap: 14 }}>
          <View style={[styles.handle, { backgroundColor: colors.border, alignSelf: "center" }]} />
          <Skeleton width={160} height={11} radius={4} />
          <Skeleton width={180} height={14} radius={4} />
          <Skeleton width="80%" height={34} radius={8} />
          <Skeleton width="100%" height={14} radius={4} />
          <Skeleton width="92%" height={14} radius={4} />
          <Skeleton width="65%" height={14} radius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: colors.surfaceAlt,
  },
  sheet: {
    flex: 1,
    marginTop: 348,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  sheetTopFade: {
    position: "absolute",
    top: -16,
    left: 0,
    right: 0,
    height: 28,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 140,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  eyebrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkMuted,
    letterSpacing: 1.2,
  },
  localFave: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  localFaveText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 10,
    color: colors.inkSoft,
  },
  localName: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.primary,
  },
  localNameEn: {
    color: colors.inkMuted,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 34,
    color: colors.ink,
    letterSpacing: -0.4,
    lineHeight: 36,
    marginTop: 4,
  },
  oneLiner: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
    marginTop: 10,
  },
  factCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    gap: 6,
  },
  factLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  factBody: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 20,
  },
  checkCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },
  checkTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.success,
  },
  checkNote: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    fontStyle: "italic",
    marginTop: 10,
  },
  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 30,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: "#fff",
  },
  notFound: {
    fontFamily: typography.body,
    color: colors.inkMuted,
    padding: 40,
  },
});
