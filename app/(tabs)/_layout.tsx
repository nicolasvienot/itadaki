import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, Tabs, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Loader } from "../../src/components/Loader";
import { colors, typography } from "../../src/constants/colors";
import { useAppStore } from "../../src/store/useAppStore";

const ICON_SIZE = 22;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * Custom tab cell — centers icon + label vertically inside the floating bar.
 * Active state is derived from the current route via useSegments so it stays
 * in sync regardless of how navigation is triggered.
 */
function TabBarButton({
  routeName,
  label,
  icon,
  onPress,
}: {
  routeName: "index" | "discover" | "passport";
  label: string;
  icon: IconName;
  onPress?: (e: GestureResponderEvent) => void;
}) {
  const segments = useSegments() as string[];
  // Inside the (tabs) group, the leaf segment is the route name (e.g. "discover").
  // For the home tab the leaf is "(tabs)" or "index" (or absent on first render).
  const leaf = segments[segments.length - 1] ?? "";
  const active =
    routeName === "index"
      ? leaf === "(tabs)" || leaf === "index" || leaf === ""
      : leaf === routeName;

  const tint = active ? colors.primary : colors.inkMuted;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.05)", borderless: true }}
      style={styles.tabButton}
      hitSlop={4}
    >
      <MaterialCommunityIcons name={icon} size={ICON_SIZE} color={tint} />
      <Text style={[styles.tabLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

function FloatingTabBarBackground() {
  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={80}
        tint="light"
        style={[StyleSheet.absoluteFill, styles.blurContainer]}
      />
    );
  }
  return <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />;
}

export default function TabLayout() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const [hasStoredDestination, setHasStoredDestination] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkStoredDestination() {
      try {
        const storedDestination = await SecureStore.getItemAsync("activeDestinationId");
        setHasStoredDestination(!!storedDestination);
      } catch (error) {
        console.error("Error checking stored destination:", error);
        setHasStoredDestination(false);
      }
    }

    checkStoredDestination();
  }, []);

  if (hasStoredDestination === null) {
    return <Loader text="Loading..." />;
  }

  if (!onboardingComplete && !hasStoredDestination) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <FloatingTabBarBackground />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButton: (props) => (
            <TabBarButton
              routeName="index"
              label="Home"
              icon="home-variant-outline"
              onPress={props.onPress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarButton: (props) => (
            <TabBarButton
              routeName="discover"
              label="Discover"
              icon="compass-outline"
              onPress={props.onPress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: "Passport",
          tabBarButton: (props) => (
            <TabBarButton
              routeName="passport"
              label="Passport"
              icon="book-open-variant"
              onPress={props.onPress}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const TAB_BAR_HEIGHT = 64;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 28,
    marginHorizontal: 16,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 8,
    overflow: "hidden",
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  blurContainer: {
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(250, 247, 242, 0.7)",
  },
  androidBackground: {
    borderRadius: TAB_BAR_HEIGHT / 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.2,
    lineHeight: 13,
    marginTop: 1,
  },
});
