import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../src/constants/colors";

const WELCOME_HERO_IMAGE = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=90";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Welcome() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Redirect to main app on native platforms
  useEffect(() => {
    if (Platform.OS !== "web") {
      router.replace("/(tabs)");
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    // Check if already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // If already installed, go to app
    if (standalone) {
      router.replace("/(tabs)");
      return;
    }

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for install prompt (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  // Don't render on native
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image
        source={{ uri: WELCOME_HERO_IMAGE }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        priority="high"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Top brand */}
        <View style={styles.topSection}>
          <Text style={styles.brand}>Itadaki</Text>
          <Text style={styles.tagline}>いただき</Text>
        </View>

        {/* Center content */}
        <View style={styles.centerSection}>
          <Text style={styles.heroTitle}>Your culinary{"\n"}passport awaits</Text>
          <Text style={styles.heroSub}>
            Track the local dishes you've tried.{"\n"}
            Build your food journey, city by city.
          </Text>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomSection}>
          {/* Android/Chrome: Install button */}
          {deferredPrompt && (
            <TouchableOpacity
              style={styles.installButton}
              onPress={handleInstall}
              activeOpacity={0.9}
            >
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.installButtonText}>Install App</Text>
            </TouchableOpacity>
          )}

          {/* iOS: Instructions */}
          {isIOS && !deferredPrompt && (
            <View style={styles.iosInstructions}>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <Ionicons name="share-outline" size={22} color="#fff" />
                </View>
                <Text style={styles.iosText}>
                  Tap the <Text style={styles.iosBold}>Share</Text> button below
                </Text>
              </View>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <MaterialCommunityIcons name="plus-box-outline" size={22} color="#fff" />
                </View>
                <Text style={styles.iosText}>
                  Then tap <Text style={styles.iosBold}>Add to Home Screen</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Desktop or fallback */}
          {!isIOS && !deferredPrompt && (
            <View style={styles.desktopNote}>
              <Ionicons name="phone-portrait-outline" size={18} color="rgba(255,255,255,0.7)" />
              <Text style={styles.desktopNoteText}>
                Open on your phone to install
              </Text>
            </View>
          )}

          {/* Continue link */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>Continue in browser</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  safe: {
    flex: 1,
    justifyContent: "space-between",
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  brand: {
    fontFamily: typography.serifItalic,
    fontSize: 28,
    color: "#fff",
  },
  tagline: {
    fontFamily: typography.body,
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  centerSection: {
    paddingHorizontal: 24,
  },
  heroTitle: {
    fontFamily: typography.serif,
    fontSize: 42,
    color: "#fff",
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontFamily: typography.body,
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
    marginTop: 16,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  installButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  installButtonText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 17,
    color: "#fff",
  },
  iosInstructions: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 20,
    gap: 16,
  },
  iosStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iosIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  iosText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    flex: 1,
  },
  iosBold: {
    fontFamily: typography.bodySemiBold,
    color: "#fff",
  },
  desktopNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  desktopNoteText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
  },
  continueText: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
  },
});
