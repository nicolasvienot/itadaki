import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckoffSuccess } from "../../src/components/CheckoffSuccess";
import { Loader } from "../../src/components/Loader";
import { LocationPickerSheet } from "../../src/components/LocationPickerSheet";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { StarRating } from "../../src/components/StarRating";
import { colors, numStyle, typography } from "../../src/constants/colors";
import { useCheckOff } from "../../src/hooks/useCheckOff";
import { useDestinationDetail } from "../../src/hooks/useDestinationDetail";
import { RestaurantLocation } from "../../src/types";

export default function CaptureScreen() {
  const { dishId, destinationId } = useLocalSearchParams<{
    dishId: string;
    destinationId: string;
  }>();
  const router = useRouter();
  const { destination, checks, isLoading } = useDestinationDetail(destinationId);
  const dish = destination?.dishes.find((d) => d.id === dishId);
  const existingCheck = checks[dishId];
  const checkOff = useCheckOff();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [location, setLocation] = useState<RestaurantLocation | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [stamped, setStamped] = useState(false);

  // Seed form from an existing check (edit flow). Runs once when the check loads.
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || !existingCheck) return;
    seededRef.current = true;
    setRating(existingCheck.rating ?? 0);
    setNote(existingCheck.note ?? "");
    setPhotoUri(existingCheck.photo_url ?? null);
    if (existingCheck.restaurant_name) {
      setLocation({
        name: existingCheck.restaurant_name,
        area: existingCheck.restaurant_area ?? undefined,
        lat: existingCheck.restaurant_lat ?? undefined,
        lng: existingCheck.restaurant_lng ?? undefined,
      });
    }
  }, [existingCheck]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!dish) return;
    // Remote URLs (already-uploaded photos kept from a prior save) start with http(s).
    // Anything else (file://, content://, ph://) is a freshly-picked local photo to upload.
    const isRemote = !!photoUri && /^https?:\/\//.test(photoUri);
    try {
      await checkOff.mutateAsync({
        dishId: dish.id,
        destinationId: dish.destinationId,
        rating: rating > 0 ? rating : undefined,
        note: note.trim() || undefined,
        localPhotoUri: photoUri && !isRemote ? photoUri : undefined,
        existingPhotoUrl: isRemote ? photoUri : undefined,
        location,
      });
      setStamped(true);
    } catch {
      // error displayed via checkOff.isError in the UI
    }
  };

  if (isLoading) return <Loader />;
  if (!dish || !destination) return null;

  // Success takeover — mounts after a successful save.
  if (stamped) {
    const triedNow = Object.keys(checks).length + (checks[dish.id] ? 0 : 1);
    return (
      <CheckoffSuccess
        dishName={dish.name}
        destinationName={destination.name}
        triedCount={triedNow}
        totalCount={destination.dishes.length}
        onDone={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader
        onBack={() => router.back()}
        title="Check off"
        closeIcon
        large
        right={
          <TouchableOpacity
            onPress={handleSave}
            disabled={checkOff.isPending || stamped}
            hitSlop={8}
          >
            <Text style={styles.headerSave}>Save</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Dish ID */}
        <View style={styles.dishHeader}>
          <Text style={styles.localName}>
            {dish.localName} <Text style={styles.localNameEn}>· {dish.name}</Text>
          </Text>
          <Text style={styles.name}>{dish.name}</Text>
        </View>

        {/* Photo upload */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionLabelInset}>SNAP A PHOTO</Text>
          {photoUri ? (
            <TouchableOpacity onPress={pickPhoto} activeOpacity={0.85}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} contentFit="cover" />
              <Text style={styles.changePhoto}>Tap to change photo</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} activeOpacity={0.85}>
                <MaterialCommunityIcons name="camera-outline" size={26} color={colors.inkSoft} />
                <Text style={styles.photoBtnLabel}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto} activeOpacity={0.85}>
                <MaterialCommunityIcons name="image-outline" size={26} color={colors.inkSoft} />
                <Text style={styles.photoBtnLabel}>Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Rating */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>HOW WAS IT?</Text>
          <View style={styles.ratingCard}>
            <StarRating value={rating} onChange={setRating} size={26} />
            <Text style={numStyle(20)}>{rating > 0 ? rating.toFixed(1) : "—"}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>WHERE YOU TRIED IT</Text>
          <TouchableOpacity
            style={styles.locationCard}
            onPress={() => setLocationOpen(true)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.locationIcon,
                location ? styles.locationIconActive : null,
              ]}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color={location ? "#fff" : colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              {location ? (
                <>
                  <Text style={styles.locationTitle} numberOfLines={1}>
                    {location.name}
                  </Text>
                  <Text style={styles.locationSub} numberOfLines={1}>
                    {location.area
                      ? `${location.area} · Tap to change`
                      : "Tap to change"}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.locationTitle}>Add a place</Text>
                  <Text style={styles.locationSub}>
                    Pin where you ate (optional)
                  </Text>
                </>
              )}
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={colors.inkMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Note */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>ONE-LINE MEMORY</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Crispier than I expected. Worth the queue…"
            placeholderTextColor={colors.inkMuted}
            maxLength={120}
            returnKeyType="done"
            multiline
          />
        </View>

        {/* Save CTA */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={[styles.cta, (checkOff.isPending || stamped) && styles.ctaDisabled]}
            onPress={handleSave}
            disabled={checkOff.isPending || stamped}
            activeOpacity={0.9}
          >
            {checkOff.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaText}>Save check-off</Text>
            )}
          </TouchableOpacity>

          {checkOff.isError && (
            <Text style={styles.error}>
              Something went wrong — check your Supabase connection.
            </Text>
          )}
        </View>
      </ScrollView>

      <LocationPickerSheet
        visible={locationOpen}
        initial={location}
        onClose={() => setLocationOpen(false)}
        onSave={(loc) => {
          setLocation(loc);
          setLocationOpen(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerSave: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.primary,
  },
  scroll: {
    paddingTop: 8,
    paddingBottom: 40,
  },

  // Dish title block (matches design's `0 24px 18px`)
  dishHeader: {
    paddingHorizontal: 24,
    paddingBottom: 22,
  },
  localName: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.primary,
  },
  localNameEn: {
    color: colors.inkMuted,
  },
  name: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.4,
    lineHeight: 32,
    marginTop: 2,
  },

  // Photo section: cards at 16px, label at 24px (matches design)
  photoSection: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  sectionLabelInset: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  photoButtons: {
    flexDirection: "row",
    gap: 10,
  },
  photoBtn: {
    flex: 1,
    height: 120,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoBtnLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.inkSoft,
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
  },
  changePhoto: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: 8,
  },

  // Rating + Note: 24px horizontal
  fieldSection: {
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  sectionLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  ratingCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  locationIconActive: {
    backgroundColor: colors.primary,
  },
  locationTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  locationSub: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.ink,
    minHeight: 56,
  },

  // CTA: 16px horizontal
  ctaWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: "#fff",
  },
  error: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.errorRed,
    textAlign: "center",
    marginTop: 12,
  },
});
