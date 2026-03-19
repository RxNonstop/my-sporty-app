import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import FasesCampeonatoScreen from '../screens/FasesCampeonatoScreen';
import FixtureFaseScreen from '../screens/FixtureFaseScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FasesCampeonatoScreen" component={FasesCampeonatoScreen} />
      <Stack.Screen name="FixtureFaseScreen" component={FixtureFaseScreen} />
    </Stack.Navigator>
  );
}
