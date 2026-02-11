import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { StatusBar } from "expo-status-bar";
import AuthSync from "@/components/AuthSync";
import SocketConnection from "@/components/SocketConnection";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // Clerk sağlayıcısı ile kimlik doğrulama yönetimi
    <ClerkProvider tokenCache={tokenCache}>
      {/* React Query sağlayıcısı ile sunucu durumu yönetimi */}
      <QueryClientProvider client={queryClient}>
        {/* Kullanıcı verilerini backend ile senkronize eden bileşen */}
        <AuthSync />
        {/* Socket bağlantısını yöneten bileşen */}
        <SocketConnection />
        <StatusBar style="light"></StatusBar>
        {/* Navigasyon yığını (Stack) yapılandırması */}
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0D0F" } }} >
          <Stack.Screen name="(auth)" options={{ animation: "fade" }}></Stack.Screen>
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }}></Stack.Screen>
          <Stack.Screen name="sso-callback" options={{ animation: "fade" }}></Stack.Screen>
          <Stack.Screen name="new-chat" options={{ animation: "slide_from_bottom", presentation: "modal", gestureEnabled: true }}></Stack.Screen>
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
