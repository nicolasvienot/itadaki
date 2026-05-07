import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { BadgeGrid } from "../../src/components/BadgeGrid";
import { PassportShareCard } from "../../src/components/PassportShareCard";
import { ProgressBar } from "../../src/components/ProgressBar";
import { colors, numStyle, typography } from "../../src/constants/colors";
import { useAuthUser } from "../../src/hooks/useAuthUser";
import { usePassportStats } from "../../src/hooks/usePassportStats";
import { useAppStore } from "../../src/store/useAppStore";

export default function PassportScreen() {
  const router = useRouter();
  const { data: stats, isLoading, isError } = usePassportStats();
  const { user } = useAuthUser();
  const cardRef = useRef<ViewShot>(null);
  const [shareVisible, setShareVisible] = useState(false);
  const activeDestinationId = useAppStore((s) => s.activeDestinationId);

  const handleShare = async () => {
    try {
      setShareVisible(true);
      await new Promise((r) => setTimeout(r, 50));
      const uri = await cardRef.current?.capture?.();
      if (uri) await Sharing.shareAsync(uri, { mimeType: "image/png" });
    } catch {
      // share not available on simulator
    } finally {
      setShareVisible(false);
    }
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>
          Couldn't load your passport. Check your connection.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading || !stats) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Loading your passport…</Text>
      </SafeAreaView>
    );
  }

  const unlockedBadges = stats.badges.filter((b) => b.unlocked).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title row + settings gear */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Food passport</Text>
            <Text style={styles.sub}>Your edible record of the world</Text>
          </View>
          <TouchableOpacity
            style={styles.gearBtn}
            onPress={() => router.push("/settings")}
            hitSlop={8}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={20}
              color={colors.ink}
            />
          </TouchableOpacity>
        </View>

        {/* Stats card */}
        <View style={styles.statsCardWrap}>
          <View style={styles.statsCard}>
            {[
              { num: stats.totalDishes, label: "DISHES" },
              { num: stats.countriesVisited, label: "COUNTRIES" },
              { num: unlockedBadges, label: "BADGES" },
            ].map((s, i, arr) => (
              <View key={s.label} style={styles.statsItemRow}>
                <View style={styles.statsItem}>
                  <Text
                    style={[numStyle(36, colors.ink), { textAlign: "center" }]}
                  >
                    {s.num}
                  </Text>
                  <Text style={styles.statsItemLabel}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.statsDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Destinations */}
        {stats.destinationProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESTINATIONS</Text>
            <View style={styles.destList}>
              {stats.destinationProgress.map((dest) => (
                <View key={dest.destinationId} style={styles.destCard}>
                  {dest.destinationId === activeDestinationId && (
                    <View style={styles.activeStamp}>
                      <Text style={styles.activeStampWord}>active</Text>
                      <Text style={styles.activeStampYear}>2026</Text>
                    </View>
                  )}
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destCountry}>{dest.country}</Text>
                  <View style={{ marginTop: 14 }}>
                    <ProgressBar
                      tried={dest.triedCount}
                      total={dest.totalCount}
                      height={6}
                      showLabel={false}
                    />
                    <View style={styles.destStatsRow}>
                      <Text style={styles.destStatsText}>
                        {dest.triedCount} of {dest.totalCount} dishes
                      </Text>
                      <Text style={styles.destStatsText}>
                        {Math.round(
                          (dest.triedCount / Math.max(1, dest.totalCount)) *
                            100,
                        )}
                        %
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            BADGES · {unlockedBadges} OF {stats.badges.length}
          </Text>
          <View style={styles.badgesWrap}>
            <BadgeGrid badges={stats.badges} />
          </View>
        </View>

        {/* Share */}
        <View style={styles.shareWrap}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Text style={styles.shareBtnText}>Share my passport</Text>
            <MaterialCommunityIcons
              name="arrow-up"
              size={16}
              color={colors.bg}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Off-screen render of share card for view-shot */}
      {shareVisible && (
        <View style={styles.offscreen} pointerEvents="none">
          <ViewShot ref={cardRef} options={{ format: "png", quality: 1 }}>
            <PassportShareCard
              stats={stats}
              ownerName={user?.email?.split("@")[0] ?? "You"}
            />
          </ViewShot>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  loading: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.inkMuted,
    padding: 40,
    textAlign: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 12,
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
  gearBtn: {
    width: 38,
    height: 38,
    borderRadius: 38,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  statsCardWrap: {
    paddingHorizontal: 16,
    paddingBottom: 22,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
  },
  statsItemRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  statsItem: {
    flex: 1,
    alignItems: "center",
  },
  statsDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  statsItemLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 10,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    marginTop: 6,
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
  destList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  destCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },
  activeStamp: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 56,
    height: 56,
    borderRadius: 56,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-12deg" }],
    opacity: 0.85,
  },
  activeStampWord: {
    fontFamily: typography.serifItalic,
    fontSize: 11,
    color: colors.primary,
    lineHeight: 11,
  },
  activeStampYear: {
    fontFamily: typography.bodyBold,
    fontSize: 8,
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 2,
  },
  destName: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 24,
  },
  destCountry: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 3,
  },
  destStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  destStatsText: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.inkSoft,
  },
  badgesWrap: {
    paddingHorizontal: 16,
  },
  shareWrap: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  shareBtn: {
    backgroundColor: colors.ink,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareBtnText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: colors.bg,
  },
  offscreen: {
    position: "absolute",
    left: -9999,
    top: -9999,
    opacity: 0,
  },
});
