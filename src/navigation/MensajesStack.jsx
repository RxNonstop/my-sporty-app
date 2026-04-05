import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MensajesScreen from "../screens/MensajesScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createNativeStackNavigator();

export default function MensajesStack() {
  return (
    <Stack.Navigator
      initialRouteName="MensajesScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="MensajesScreen"
        component={MensajesScreen}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
      />
      <Stack.Screen
        name="MiembroPerfil"
        component={PerfilScreen}
      />
    </Stack.Navigator>
  );
}
