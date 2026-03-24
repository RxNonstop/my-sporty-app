import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CrearEventoScreen from "../screens/CrearEventoScreen";
import SeleccionarEquiposScreen from "../screens/SeleccionarEquiposScreen";
import CrearEquipoScreen from "../screens/CrearEquipoScreen";
import FasesCampeonatoScreen from "../screens/FasesCampeonatoScreen";
import FixtureFaseScreen from "../screens/FixtureFaseScreen";
import EquipoMiembrosScreen from "../screens/EquipoMiembrosScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createNativeStackNavigator();

export default function EventoStack() {
  return (
    <Stack.Navigator
      initialRouteName="CrearEvento"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="CrearEvento"
        component={CrearEventoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeleccionarEquipos"
        component={SeleccionarEquiposScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FasesCampeonatoScreen"
        component={FasesCampeonatoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FixtureFaseScreen"
        component={FixtureFaseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EquipoMiembrosScreen"
        component={EquipoMiembrosScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MiembroPerfil"
        component={PerfilScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
