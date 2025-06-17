import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import StackNavigator from './StackNavigator';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen
        name="Inicio"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Configuración" component={ConfiguracionScreen} />
    </Drawer.Navigator>
  );
}