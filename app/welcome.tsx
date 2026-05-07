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

const WELCOME_HERO_IMAGE =
  "https://images.unsplash.com/photo-1590559899731-a382839e5549";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Detect if running in an in-app browser (WebView)
function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  // Common in-app browser indicators
  return (
    /FBAN|FBAV|Instagram|Messenger|Twitter|Line|WhatsApp|Snapchat|LinkedIn/i.test(
      ua
    ) ||
    // Generic WebView detection
    /wv\)/.test(ua) ||
    // Android WebView
    (/Android/.test(ua) && /Version\/[\d.]+/.test(ua) && !/Chrome/.test(ua))
  );
}

// Detect if on mobile device
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export default function Welcome() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

    // Check platform
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const android = /Android/.test(navigator.userAgent);
    setIsIOS(ios);
    setIsAndroid(android);
    setIsInApp(isInAppBrowser());
    setIsMobile(isMobileDevice());

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
          <Text style={styles.heroTitle}>
            Your culinary{"\n"}passport awaits
          </Text>
          <Text style={styles.heroSub}>
            Track the local dishes you've tried.{"\n"}
            Build your food journey, city by city.
          </Text>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomSection}>
          {/* In-app browser (Messenger, Facebook, etc.): Instructions to open in real browser */}
          {isInApp && (
            <View style={styles.iosInstructions}>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                </View>
                <Text style={styles.iosText}>
                  Tap the <Text style={styles.iosBold}>menu</Text> (⋯) at the
                  top right
                </Text>
              </View>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <Ionicons name="globe-outline" size={22} color="#fff" />
                </View>
                <Text style={styles.iosText}>
                  Select{" "}
                  <Text style={styles.iosBold}>
                    Open in {isIOS ? "Safari" : "Chrome"}
                  </Text>
                </Text>
              </View>
              <Text style={styles.inAppNote}>
                PWA installation requires a real browser
              </Text>
            </View>
          )}

          {/* Android/Chrome: Install button */}
          {!isInApp && deferredPrompt && (
            <TouchableOpacity
              style={styles.installButton}
              onPress={handleInstall}
              activeOpacity={0.9}
            >
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.installButtonText}>Install App</Text>
            </TouchableOpacity>
          )}

          {/* iOS (not in-app): Instructions */}
          {!isInApp && isIOS && !deferredPrompt && (
            <View style={styles.iosInstructions}>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <Ionicons name="share-outline" size={22} color="#fff" />
                </View>
                <Text style={styles.iosText}>
                  Tap the <Text style={styles.iosBold}>Share</Text> button on
                  top of the page
                </Text>
              </View>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <MaterialCommunityIcons
                    name="plus-box-outline"
                    size={22}
                    color="#fff"
                  />
                </View>
                <Text style={styles.iosText}>
                  Then tap{" "}
                  <Text style={styles.iosBold}>Add to Home Screen</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Android without install prompt (rare browser): Manual instructions */}
          {!isInApp && isAndroid && !deferredPrompt && (
            <View style={styles.iosInstructions}>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={22}
                    color="#fff"
                  />
                </View>
                <Text style={styles.iosText}>
                  Tap the <Text style={styles.iosBold}>menu</Text> (⋮) in Chrome
                </Text>
              </View>
              <View style={styles.iosStep}>
                <View style={styles.iosIconWrap}>
                  <MaterialCommunityIcons
                    name="plus-box-outline"
                    size={22}
                    color="#fff"
                  />
                </View>
                <Text style={styles.iosText}>
                  Select{" "}
                  <Text style={styles.iosBold}>Add to Home screen</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Desktop: Open on phone */}
          {!isInApp && !isMobile && !deferredPrompt && (
            <View style={styles.desktopNote}>
              <Ionicons
                name="phone-portrait-outline"
                size={18}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={styles.desktopNoteText}>
                Open on your phone to install
              </Text>
            </View>
          )}
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
  inAppNote: {
    fontFamily: typography.body,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 8,
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
