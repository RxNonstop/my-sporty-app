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
import { ThemeProvider } from "./src/context/ThemeContext";
import { useContext } from "react";
import { View } from "react-native";
import { EquipoProvider } from "./src/context/EquipoContext";


function AppContent() {
  const { usuario } = useContext(AuthContext);
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {usuario ? <DrawerNavigator /> : <AuthStack />}
      </NavigationContainer>
    </View>
  );
}

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
                      <AppContent />
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
