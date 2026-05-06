import { useState } from 'react';
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
} from 'react-native';
import { colors, typography } from '../constants/colors';
import { supabase } from '../lib/supabase';

type Mode = 'create' | 'signin';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (mode: Mode) => void;
}

export function AccountModal({ visible, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('create');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const reset = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setLoading(false);
    setDone(false);
    setMode('create');
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
      if (mode === 'create') {
        const { error } = await supabase.auth.updateUser({ email, password });
        if (error) throw error;
        setDone(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        reset();
        onSuccess('signin');
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Account</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {done ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>✉️</Text>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successBody}>
                We sent a confirmation link to {email}. Click it to activate your account — your
                progress is already saved.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClose} activeOpacity={0.85}>
                <Text style={styles.btnText}>Got it</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                {mode === 'create'
                  ? 'Link an email to your account so your progress syncs across devices.'
                  : 'Sign in to restore your progress on this device.'}
              </Text>

              <View style={styles.segmented}>
                <TouchableOpacity
                  style={[styles.segment, mode === 'create' && styles.segmentActive]}
                  onPress={() => { setMode('create'); setError(null); }}
                >
                  <Text style={[styles.segmentText, mode === 'create' && styles.segmentTextActive]}>
                    Create account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, mode === 'signin' && styles.segmentActive]}
                  onPress={() => { setMode('signin'); setError(null); }}
                >
                  <Text style={[styles.segmentText, mode === 'signin' && styles.segmentTextActive]}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.mutedStone}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor={colors.mutedStone}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={[styles.btn, (loading || !email || !password) && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={loading || !email || !password}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>
                    {mode === 'create' ? 'Create account' : 'Sign in'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 24, gap: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  title: { fontFamily: typography.serif, fontSize: 24, color: colors.inkBlack },
  cancel: { fontFamily: typography.body, fontSize: 16, color: colors.terracotta },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.mutedStone,
    lineHeight: 21,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.warmWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 3,
  },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.terracotta },
  segmentText: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.mutedStone },
  segmentTextActive: { color: '#fff' },
  form: { gap: 12 },
  input: {
    backgroundColor: colors.warmWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.inkBlack,
  },
  error: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.errorRed,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: colors.terracotta,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: typography.bodyMedium, fontSize: 16, color: '#fff' },
  successCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 28,
    gap: 16,
    alignItems: 'center',
  },
  successEmoji: { fontSize: 48 },
  successTitle: { fontFamily: typography.serif, fontSize: 22, color: colors.inkBlack },
  successBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.mutedStone,
    lineHeight: 21,
    textAlign: 'center',
  },
});
