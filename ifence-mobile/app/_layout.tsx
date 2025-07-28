import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View, Image, Text } from "react-native";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
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
        {/* <Stack.Screen name="(auth)/LoginScreen" /> */}
        <Stack.Screen
          name="auth/CadastroScreen"
          // options={{ title: "Criar Conta" }}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Screens/EditarUsuario" 
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require("../assets/images/pai-filho.png")}
                  style={{ width: 32, height: 32, marginRight: 8 }}
                  resizeMode="contain"
                />
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>IFence</Text>
              </View>
            ),
            headerStyle: { backgroundColor: '#003F88' },
            headerTintColor: '#fff',
            headerLeft: () => null,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
