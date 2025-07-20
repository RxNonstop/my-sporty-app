import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from '../screens/HomeScreen';
import CrearEventoScreen from '../screens/CrearEventoScreen';
import SeleccionarEquiposScreen from '../screens/SeleccionarEquiposScreen';
import CrearEquipoScreen from '../screens/CrearEquipoScreen';
import EquiposScreen from '../screens/EquiposScreen';


export default function EquipoStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName='EquiposScreen' screenOptions={{ headerShown: true }}>
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
    </Stack.Navigator>
  );
}