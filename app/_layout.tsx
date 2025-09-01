import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { initAuthTokenFromStorage } from "@/utils/api";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Carrega o token salvo antes de esconder a splash
      initAuthTokenFromStorage().finally(() => SplashScreen.hideAsync());
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/ListarLocalizacoesPulseira" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/EditarUsuario" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/ListarRotasPulseiras" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Map" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Notifications" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(auth)/LoginScreen" /> */}
        <Stack.Screen
          name="auth/CadastroScreen"
          // options={{ title: "Criar Conta" }}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
