import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  useFonts,
} from "@expo-google-fonts/playfair-display";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { colors, typography } from "../src/constants/colors";
import { queryClient } from "../src/lib/queryClient";
import { ensureAnonymousSession } from "../src/lib/supabase";
import { useAppStore } from "../src/store/useAppStore";

SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  headerBg: { flex: 1, backgroundColor: colors.cream },
});

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    async function init() {
      await Promise.all([hydrate(), ensureAnonymousSession()]);
      SplashScreen.hideAsync();
    }
    if (fontsLoaded) init();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.inkBlack,
          headerTitleStyle: {
            fontFamily: typography.serif,
            fontSize: 18,
          },
          headerBackButtonDisplayMode: "minimal",
          headerBackground: () => <View style={styles.headerBg} />,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="destination/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="dish/[destinationId]/[dishId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="capture/[dishId]"
          options={{ presentation: "modal", headerShown: false }}
        />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
