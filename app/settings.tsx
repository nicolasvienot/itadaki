import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AccountModal } from "../src/components/AccountModal";
import { ScreenHeader } from "../src/components/ScreenHeader";
import { Skeleton } from "../src/components/Skeleton";
import { colors, typography } from "../src/constants/colors";
import { useAuthUser } from "../src/hooks/useAuthUser";
import { ensureAnonymousSession, supabase } from "../src/lib/supabase";
import { useAppStore } from "../src/store/useAppStore";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAnonymous, loading } = useAuthUser();
  const queryClient = useQueryClient();
  const { setActiveDestination, setOnboardingComplete, reset } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "signin">("create");

  const openSync = (mode: "create" | "signin") => {
    setModalMode(mode);
    setModalVisible(true);
  };

  const handleAuthSuccess = async (mode: "create" | "signin") => {
    setModalVisible(false);
    if (mode === "signin") {
      queryClient.invalidateQueries();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (u) {
        const { data } = await supabase
          .from("active_destinations")
          .select("destination_id")
          .eq("user_id", u.id)
          .order("added_at", { ascending: false })
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
      "Sign out",
      "You will be signed out and start a fresh anonymous session. Your cloud progress is safe — just sign in again to restore it.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
            await ensureAnonymousSession();
            queryClient.invalidateQueries();
            await reset();
            router.replace("/onboarding");
          },
        },
      ]
    );
  };

  const initial = (user?.email ?? "?").charAt(0).toUpperCase();
  const name = user?.email?.split("@")[0] ?? "Guest";

  return (
    <View style={styles.safe}>
      <ScreenHeader
        onBack={() => router.back()}
        title="Settings"
        closeIcon
        large
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          // Skeleton — auth not yet resolved on cold boot
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Skeleton width={56} height={56} radius={56} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="60%" height={22} radius={6} />
                <Skeleton width="80%" height={13} radius={4} />
              </View>
            </View>
            <Skeleton width="100%" height={48} radius={14} />
          </View>
        ) : isAnonymous ? (
          // Anonymous state — show sync invitation
          <>
            <View style={styles.inviteCard}>
              <View style={styles.inviteIcon}>
                <MaterialCommunityIcons name="cloud-sync-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.inviteTitle}>Sync your passport</Text>
              <Text style={styles.inviteBody}>
                Link an email so your dishes, photos, and notes stay safe across devices.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => openSync("create")}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBtnText}>Create account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => openSync("signin")}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryBtnText}>I already have one</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.hintCard}>
              <View style={styles.hintIcon}>
                <Text style={styles.hintIconText}>i</Text>
              </View>
              <Text style={styles.hintText}>
                You can keep eating without an account — your progress stays on this device until
                you decide to sync.
              </Text>
            </View>
          </>
        ) : (
          // Signed in — profile + sync status + sign out
          <>
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.profileName}>{name}</Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {user?.email}
                  </Text>
                </View>
              </View>

              <View style={styles.syncStatus}>
                <View style={styles.syncCheck}>
                  <MaterialCommunityIcons name="check" size={12} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.syncTitle}>Synced &amp; backed up</Text>
                  <Text style={styles.syncSub}>Last synced just now</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={handleSignOut}
              activeOpacity={0.85}
            >
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.version}>Itadaki · v1.4.0</Text>
      </ScrollView>

      <AccountModal
        visible={modalVisible}
        initialMode={modalMode}
        onClose={() => setModalVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
    gap: 16,
  },

  // Anonymous (sync invite)
  inviteCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    gap: 12,
  },
  inviteIcon: {
    width: 56,
    height: 56,
    borderRadius: 56,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  inviteTitle: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
  },
  inviteBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 8,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: "#fff",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.inkSoft,
  },
  hintCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    padding: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  hintIcon: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  hintIconText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: "#fff",
  },
  hintText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 18,
  },

  // Signed in
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 18,
    gap: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 56,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: typography.serif,
    fontSize: 24,
    color: "#fff",
  },
  profileName: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 24,
  },
  profileEmail: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 3,
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.primary + "12",
  },
  syncCheck: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  syncTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.ink,
  },
  syncSub: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 1,
  },
  signOutBtn: {
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  signOutText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.inkSoft,
  },

  version: {
    textAlign: "center",
    marginTop: 12,
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.inkMuted,
  },
});
