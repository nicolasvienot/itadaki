import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { colors, typography } from "../../src/constants/colors";
import { useAppStore } from "../../src/store/useAppStore";
import { Loader } from "../../src/components/Loader";

function TabIcon({
  name,
  active,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  active: boolean;
}) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={22}
      color={active ? colors.terracotta : colors.mutedStone}
    />
  );
}

function FloatingTabBarBackground() {
  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={70}
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
        const storedDestination = await SecureStore.getItemAsync('activeDestinationId');
        setHasStoredDestination(!!storedDestination);
      } catch (error) {
        console.error('Error checking stored destination:', error);
        setHasStoredDestination(false);
      }
    }
    
    checkStoredDestination();
  }, []);

  if (hasStoredDestination === null) {
    return <Loader text="Loading..." />;
  }

  // redirect only when both Zustand state and SecureStore are clear — handles fresh install vs sign-out
  if (!onboardingComplete && !hasStoredDestination) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <FloatingTabBarBackground />,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.mutedStone,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-variant" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="compass-outline" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: "Passport",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="book-open-variant" active={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    marginHorizontal: 20,
    height: 72,
    borderRadius: 24,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
    overflow: "hidden",
    shadowColor: colors.inkBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
  },
  androidBackground: {
    borderRadius: 24,
    backgroundColor: "rgba(245,239,224,0.94)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  tabLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    marginBottom: 6,
  },
  tabItem: {
    paddingTop: 12,
    paddingBottom: 0,
  },
});
