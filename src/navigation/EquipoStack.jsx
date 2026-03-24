import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CrearEventoScreen from "../screens/CrearEventoScreen";
import SeleccionarEquiposScreen from "../screens/SeleccionarEquiposScreen";
import CrearEquipoScreen from "../screens/CrearEquipoScreen";
import EquiposScreen from "../screens/EquiposScreen";
import InvitacionEquipoScreen from "../screens/InvitacionEquipoScreen";
import DetalleEquipoScreen from "../screens/DetalleEquipoScreen";

const Stack = createNativeStackNavigator();

export default function EquipoStack() {
  return (
    <Stack.Navigator
      initialRouteName="EquiposScreen"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="EquiposScreen"
        component={EquiposScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearEquipo"
        component={CrearEquipoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InvitacionEquipoScreen"
        component={InvitacionEquipoScreen}
        options={{ title: "Invitar Amigos" }}
      />
      <Stack.Screen
        name="DetalleEquipoScreen"
        component={DetalleEquipoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
