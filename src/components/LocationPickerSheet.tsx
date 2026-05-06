import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
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
import { RestaurantLocation } from '../types';

interface Props {
  visible: boolean;
  initial?: RestaurantLocation | null;
  onClose: () => void;
  onSave: (loc: RestaurantLocation | null) => void;
}

export function LocationPickerSheet({ visible, initial, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const nameRef = useRef<TextInput>(null);

  // Reset when the sheet opens, seeded from any existing value.
  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      setArea(initial?.area ?? '');
      setCoords(
        initial?.lat != null && initial?.lng != null
          ? { lat: initial.lat, lng: initial.lng }
          : null
      );
      setLocationError(null);
      setLocating(false);
    }
  }, [visible, initial]);

  const useCurrentLocation = async () => {
    setLocating(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. You can still type a place name.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });

      // Reverse geocode for a friendly area label.
      try {
        const results = await Location.reverseGeocodeAsync(pos.coords);
        const r = results[0];
        if (r) {
          const placeBits = [r.name, r.street].filter(Boolean);
          const areaBits = [r.city ?? r.subregion, r.region].filter(Boolean);
          if (!name && placeBits.length > 0) setName(placeBits.join(' '));
          if (!area && areaBits.length > 0) setArea(areaBits.join(', '));
        }
      } catch {
        // reverse geocoding is best-effort; coords still saved.
      }
    } catch {
      setLocationError("Couldn't get your location. Try again or type a place name.");
    } finally {
      setLocating(false);
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave({
      name: trimmedName,
      area: area.trim() || undefined,
      lat: coords?.lat,
      lng: coords?.lng,
    });
  };

  const handleClear = () => {
    onSave(null);
  };

  const canSave = name.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Where you tried it</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Pin the spot so it shows up on your passport. Skip if you can't remember.
          </Text>

          {/* Use current location */}
          <TouchableOpacity
            style={styles.locateBtn}
            onPress={useCurrentLocation}
            activeOpacity={0.85}
            disabled={locating}
          >
            <View style={styles.locateIcon}>
              {locating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#fff" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locateLabel}>Use my current location</Text>
              <Text style={styles.locateSub}>
                {coords
                  ? `Saved · ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                  : 'We pre-fill the area from your GPS'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={colors.inkMuted} />
          </TouchableOpacity>

          {locationError && <Text style={styles.error}>{locationError}</Text>}

          {/* Manual fields */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PLACE NAME</Text>
            <TextInput
              ref={nameRef}
              style={styles.input}
              placeholder="Yamamoto Honten"
              placeholderTextColor={colors.inkMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>AREA · OPTIONAL</Text>
            <TextInput
              style={styles.input}
              placeholder="Umeda, Osaka"
              placeholderTextColor={colors.inkMuted}
              value={area}
              onChangeText={setArea}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.9}
          >
            <Text style={styles.saveBtnText}>Save location</Text>
          </TouchableOpacity>

          {initial && (
            <TouchableOpacity onPress={handleClear} hitSlop={8} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Remove location</Text>
            </TouchableOpacity>
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
    alignSelf: 'center',
    marginBottom: -8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 28,
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
  locateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locateIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  locateSub: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  error: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.errorRed,
    marginTop: -4,
  },
  fieldGroup: { gap: 10 },
  fieldLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 1.4,
  },
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
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: '#fff',
  },
  clearBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.inkSoft,
  },
});
