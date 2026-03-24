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
import { useContext, useMemo } from "react";
import { View } from "react-native";
import { EquipoProvider } from "./src/context/EquipoContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <EquipoProvider>
              <NotificacionProvider>
                <AmistadProvider>
                  <EventoProvider>
                    <CampeonatoProvider>
                      <AppMain />
                    </CampeonatoProvider>
                  </EventoProvider>
                </AmistadProvider>
              </NotificacionProvider>
            </EquipoProvider>
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

  return (
    <NavigationContainer theme={MyTheme}>
      {usuario ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
