import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useDestinationDetail } from '../../src/hooks/useDestinationDetail';
import { useCheckOff } from '../../src/hooks/useCheckOff';
import { Loader } from '../../src/components/Loader';
import { StampAnimation } from '../../src/components/StampAnimation';
import { StarRating } from '../../src/components/StarRating';
import { colors, typography } from '../../src/constants/colors';

export default function CaptureScreen() {
  const { dishId, destinationId } = useLocalSearchParams<{ dishId: string; destinationId: string }>();
  const router = useRouter();
  const { destination, isLoading } = useDestinationDetail(destinationId);
  const dish = destination?.dishes.find((d) => d.id === dishId);
  const checkOff = useCheckOff();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [stamped, setStamped] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!dish) return;
    try {
      await checkOff.mutateAsync({
        dishId: dish.id,
        destinationId: dish.destinationId,
        rating: rating > 0 ? rating : undefined,
        note: note.trim() || undefined,
        localPhotoUri: photoUri ?? undefined,
      });
      setStamped(true);
      setTimeout(() => router.back(), 1200);
    } catch {
      // error displayed via checkOff.isError in the UI
    }
  };

  if (isLoading) return <Loader />;
  if (!dish) return null;

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Mark as tried" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <StampAnimation visible={stamped} size={140} />

        <View style={styles.header}>
          <Text style={styles.localName}>{dish.localName}</Text>
          <Text style={styles.name}>{dish.name}</Text>
        </View>

        <View style={styles.photoSection}>
          {photoUri ? (
            <TouchableOpacity onPress={pickPhoto} activeOpacity={0.85}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
              <Text style={styles.changePhoto}>Change photo</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} activeOpacity={0.85}>
                <Text style={styles.photoBtnIcon}>📷</Text>
                <Text style={styles.photoBtnLabel}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto} activeOpacity={0.85}>
                <Text style={styles.photoBtnIcon}>🖼</Text>
                <Text style={styles.photoBtnLabel}>Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Your rating</Text>
          <StarRating value={rating} onChange={setRating} size={40} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>One-line note</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Worth the queue…"
            placeholderTextColor={colors.mutedStone}
            maxLength={120}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, checkOff.isPending && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={checkOff.isPending || stamped}
          activeOpacity={0.85}
        >
          {checkOff.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Check-off</Text>
          )}
        </TouchableOpacity>

        {checkOff.isError && (
          <Text style={styles.errorText}>Something went wrong — check your Supabase connection.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 24, gap: 24, paddingBottom: 48 },
  header: { gap: 2 },
  localName: { fontFamily: typography.body, fontSize: 13, color: colors.terracotta },
  name: { fontFamily: typography.serif, fontSize: 24, color: colors.inkBlack },
  photoSection: { gap: 8 },
  photoPreview: { width: '100%', height: 200, borderRadius: 16 },
  changePhoto: { fontFamily: typography.body, fontSize: 12, color: colors.mutedStone, textAlign: 'center', marginTop: 8 },
  photoButtons: { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1,
    height: 100,
    backgroundColor: colors.warmWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoBtnIcon: { fontSize: 28 },
  photoBtnLabel: { fontFamily: typography.bodyMedium, fontSize: 12, color: colors.mutedStone },
  fieldGroup: { gap: 12 },
  fieldLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.mutedStone,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
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
  saveBtn: {
    backgroundColor: colors.terracotta,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontFamily: typography.bodyMedium, fontSize: 16, color: '#fff' },
  errorText: { fontFamily: typography.body, fontSize: 13, color: colors.errorRed, textAlign: 'center' },
});
