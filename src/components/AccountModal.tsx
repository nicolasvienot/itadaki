import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../constants/colors";
import { supabase } from "../lib/supabase";

type Mode = "create" | "signin";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (mode: Mode) => void;
  initialMode?: Mode;
}

export function AccountModal({
  visible,
  onClose,
  onSuccess,
  initialMode = "create",
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Sync mode whenever the caller opens the modal with a different initial preference.
  useEffect(() => {
    if (visible) setMode(initialMode);
  }, [visible, initialMode]);

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setLoading(false);
    setDone(false);
    setMode(initialMode);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const { error } = await supabase.auth.updateUser({ email, password });
        if (error) throw error;
        setDone(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        reset();
        onSuccess("signin");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Sync</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {done ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>✉️</Text>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successBody}>
                We sent a confirmation link to {email}. Click it to activate
                your account — your progress is already saved.
              </Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={handleClose}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>Got it</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Link an email so your passport, photos, and notes stay safe
                across devices. No marketing emails, ever.
              </Text>

              <View style={styles.segmented}>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    mode === "create" && styles.segmentActive,
                  ]}
                  onPress={() => {
                    setMode("create");
                    setError(null);
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      mode === "create" && styles.segmentTextActive,
                    ]}
                  >
                    Create account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    mode === "signin" && styles.segmentActive,
                  ]}
                  onPress={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      mode === "signin" && styles.segmentTextActive,
                    ]}
                  >
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.inkMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder={
                    mode === "create"
                      ? "Password (min 6 characters)"
                      : "Password"
                  }
                  placeholderTextColor={colors.inkMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={[
                  styles.btn,
                  (loading || !email || !password) && styles.btnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading || !email || !password}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>
                    {mode === "create" ? "Create account" : "Sign in"}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.hintCard}>
                <View style={styles.hintIcon}>
                  <Text style={styles.hintIconText}>i</Text>
                </View>
                <Text style={styles.hintText}>
                  You can keep eating without an account — your progress stays
                  on this device until you decide to sync.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 48, gap: 16 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: -8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 32,
    color: colors.ink,
  },
  cancel: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 11,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.inkSoft,
  },
  segmentTextActive: {
    fontFamily: typography.bodySemiBold,
    color: "#fff",
  },
  form: { gap: 10 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.ink,
  },
  error: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.errorRed,
    textAlign: "center",
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: "#fff",
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
    marginTop: 10,
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
  successCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    gap: 14,
    alignItems: "center",
  },
  successEmoji: { fontSize: 44 },
  successTitle: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.ink,
  },
  successBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
    textAlign: "center",
  },
});
