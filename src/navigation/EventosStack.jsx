import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventosScreen from '../screens/EventosScreen';
import FasesCampeonatoScreen from '../screens/FasesCampeonatoScreen';

const Stack = createNativeStackNavigator();

export default function EventosStack() {
  return (
    <Stack.Navigator initialRouteName="EventosScreen" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="EventosScreen"
        component={EventosScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FasesCampeonatoScreen"
        component={FasesCampeonatoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}