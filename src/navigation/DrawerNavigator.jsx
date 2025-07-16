import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import StackNavigator from './EventoStack'
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import EventoStack from './EventoStack'; // stack con pantalla oculta
import EquipoStack from './EquipoStack';
import CalendarioScreen from '../screens/CalendarioScreen';
import FriendsScreen from '../screens/FriendsScreen';
import EquiposScreen from '../screens/EquiposScreen';
import CrearEquiposScreen from '../screens/CrearEquipoScreen';
import { View, StyleSheet } from 'react-native';


import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import NotificacionesScreen from '../screens/NotificacionesScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {

  const {logout} = useContext(AuthContext)

  function CustomDrawerContent(props) {
    const { logout } = useContext(AuthContext);

    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View>
          <DrawerItemList {...props} />
        </View>

        <View style={styles.logoutContainer}>
          <DrawerItem
            label="Cerrar sesión"
            onPress={logout}
            icon={({ size, color }) => (
              <Ionicons name="log-out-outline" size={size} color="red" />
            )}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator 
    initialRouteName="Inicio"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Configuración" 
        component={ConfiguracionScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Crear Evento" 
        component={EventoStack} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Calendario" 
        component={CalendarioScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Amigos" 
        component={FriendsScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Equipos" 
        component={EquipoStack} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notificaciones" 
        component={NotificacionesScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    marginTop: 'auto', // 🔽 lo empuja al fondo
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
});