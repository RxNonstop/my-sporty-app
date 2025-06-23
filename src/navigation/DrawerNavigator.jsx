import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import CrearEventoScreen from '../screens/CrearEventoScreen';
import CalendarioScreen from '../screens/CalendarioScreen';

import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Perfil">
      <Drawer.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
      }}/>
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
      }}/>
      <Drawer.Screen 
        name="Configuración" 
        component={ConfiguracionScreen} 
        options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
      }}/>
      <Drawer.Screen 
        name="Crear Evento" 
        component={CrearEventoScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
      }}/>
      <Drawer.Screen 
      name="Calendario" 
      component={CalendarioScreen} 
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="calendar-outline" size={size} color={color} />
        ),
      }}/>
    </Drawer.Navigator>
  );
}