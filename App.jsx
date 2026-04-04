import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { EventoProvider } from "./src/context/EventoContext";
import { AmistadProvider } from "./src/context/AmistadContext";
import { NotificacionProvider } from "./src/context/NotificacionContext";
import { CampeonatoProvider } from "./src/context/CampeonatoContext";
import AuthStack from "./src/navigation/AuthStack";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { ThemeContext, ThemeProvider } from "./src/context/ThemeContext";
import { useContext, useMemo, useEffect } from "react";
import { View } from "react-native";
import { EquipoProvider } from "./src/context/EquipoContext";
import { SocketProvider } from "./src/context/SocketContext";
import { ChatProvider } from "./src/context/ChatContext";
import * as Notifications from "expo-notifications";
import { LogBox } from "react-native";

LogBox.ignoreLogs(['expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo GO with the release of SDK 53. Use a development build instead of Expo Go. Read more at https://docs.expo.dev/develop/development.builds/introduction/.']);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <EquipoProvider>
                <NotificacionProvider>
                  <AmistadProvider>
                    <EventoProvider>
                      <CampeonatoProvider>
                        <ChatProvider>
                          <AppMain />
                        </ChatProvider>
                      </CampeonatoProvider>
                    </EventoProvider>
                  </AmistadProvider>
                </NotificacionProvider>
              </EquipoProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppMain() {
  const { usuario } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  const MyTheme = useMemo(
    () => ({
      dark: isDarkMode,
      colors: {
        primary: isDarkMode ? "#3b82f6" : "#2563eb",
        background: isDarkMode ? "#171717" : "#f9fafb",
        card: isDarkMode ? "#171717" : "#f9fafb",
        text: isDarkMode ? "#ffffff" : "#111827",
        border: isDarkMode ? "#262626" : "#e5e7eb",
        notification: "#ef4444",
      },
      fonts: {
        regular: { fontFamily: "System", fontWeight: "400" },
        medium: { fontFamily: "System", fontWeight: "500" },
        bold: { fontFamily: "System", fontWeight: "700" },
        heavy: { fontFamily: "System", fontWeight: "900" },
      },
    }),
    [isDarkMode],
  );

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data.type === "amigo") {
          // Redirigir al chat de amigo
          // Necesitaremos que el Navigator esté listo, pero por ahora registramos el evento
          console.log("[Push] Tapped notification for amigo:", data.id);
        } else if (data.type === "equipo") {
          // Redirigir al chat de equipo
          console.log("[Push] Tapped notification for equipo:", data.id);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      {usuario ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
