import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import ViewShot from "react-native-view-shot";
import { AccountModal } from "../../src/components/AccountModal";
import { BadgeGrid } from "../../src/components/BadgeGrid";
import { PassportShareCard } from "../../src/components/PassportShareCard";
import { ProgressBar } from "../../src/components/ProgressBar";
import { colors, typography } from "../../src/constants/colors";
import { useAuthUser } from "../../src/hooks/useAuthUser";
import { usePassportStats } from "../../src/hooks/usePassportStats";
import { supabase, ensureAnonymousSession } from "../../src/lib/supabase";
import { useAppStore } from "../../src/store/useAppStore";

export default function PassportScreen() {
  const { data: stats, isLoading, isError } = usePassportStats();
  const { user, isAnonymous } = useAuthUser();
  const cardRef = useRef<ViewShot>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setActiveDestination, setOnboardingComplete, reset } = useAppStore();

  const handleShare = async () => {
    try {
      const uri = await cardRef.current?.capture?.();
      if (uri) await Sharing.shareAsync(uri, { mimeType: "image/png" });
    } catch {
      // share not available on simulator
    }
  };

  const handleAuthSuccess = async (mode: 'create' | 'signin') => {
    setModalVisible(false);
    if (mode === 'signin') {
      queryClient.invalidateQueries();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('active_destinations')
          .select('destination_id')
          .eq('user_id', user.id)
          .order('added_at', { ascending: false })
          .limit(1);
        if (data && data.length > 0) {
          setActiveDestination(data[0].destination_id);
          setOnboardingComplete();
        }
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'You will be signed out and start a fresh anonymous session. Your cloud progress is safe — just sign in again to restore it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            await ensureAnonymousSession();
            queryClient.invalidateQueries();
            await reset();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Couldn't load your passport. Check your connection.</Text>
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
        <Text style={styles.title}>Food passport</Text>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{stats.totalDishes}</Text>
            <Text style={styles.statLabel}>Dishes Tried</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{stats.countriesVisited}</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{unlockedBadges}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {stats.destinationProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destinations</Text>
            {stats.destinationProgress.map((dest) => (
              <View key={dest.destinationId} style={styles.destCard}>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destCountry}>{dest.country}</Text>
                <ProgressBar tried={dest.triedCount} total={dest.totalCount} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <BadgeGrid badges={stats.badges} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Your Passport</Text>
          <View style={styles.sharePreview}>
            <ViewShot ref={cardRef} options={{ format: "png", quality: 1 }}>
              <PassportShareCard stats={stats} />
            </ViewShot>
          </View>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Text style={styles.shareBtnText}>Share Card ↑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {isAnonymous ? (
            <View style={styles.accountCard}>
              <Text style={styles.accountTitle}>Save your progress</Text>
              <Text style={styles.accountBody}>
                Your progress is stored on this device. Create an account to sync it across devices
                or restore it if you reinstall the app.
              </Text>
              <View style={styles.accountBtns}>
                <TouchableOpacity
                  style={styles.accountPrimary}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.accountPrimaryText}>Create account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.accountSecondary}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.accountSecondaryText}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.accountCard}>
              <Text style={styles.accountTitle}>Signed in</Text>
              <Text style={styles.accountBody}>{user?.email}</Text>
              <TouchableOpacity
                style={styles.accountSecondary}
                onPress={handleSignOut}
                activeOpacity={0.85}
              >
                <Text style={styles.accountSecondaryText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <AccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flexGrow: 1, padding: 20, gap: 24, paddingBottom: 110 },
  loading: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.mutedStone,
    padding: 40,
    textAlign: "center",
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.inkBlack,
  },
  statsCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: "row",
    padding: 20,
  },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statNum: {
    fontFamily: typography.bodyMedium,
    fontSize: 28,
    color: colors.inkBlack,
  },
  statLabel: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: { width: 1, backgroundColor: colors.cardBorder, marginVertical: 4 },
  section: { gap: 14 },
  sectionTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.mutedStone,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  destCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    gap: 4,
  },
  destName: {
    fontFamily: typography.serif,
    fontSize: 18,
    color: colors.inkBlack,
  },
  destCountry: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.mutedStone,
    marginBottom: 8,
  },
  sharePreview: { alignItems: "center" },
  shareBtn: {
    backgroundColor: colors.terracotta,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  shareBtnText: { fontFamily: typography.bodyMedium, fontSize: 15, color: "#fff" },
  accountCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    gap: 12,
  },
  accountTitle: {
    fontFamily: typography.serif,
    fontSize: 18,
    color: colors.inkBlack,
  },
  accountBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.mutedStone,
    lineHeight: 21,
  },
  accountBtns: { flexDirection: "row", gap: 10 },
  accountPrimary: {
    flex: 1,
    backgroundColor: colors.terracotta,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  accountPrimaryText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: "#fff",
  },
  accountSecondary: {
    flex: 1,
    backgroundColor: colors.warmWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 13,
    alignItems: "center",
  },
  accountSecondaryText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.inkBlack,
  },
});
