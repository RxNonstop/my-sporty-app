import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import CrearEventoScreen from '../screens/CrearEventoScreen';
import DetalleEventoScreen from '../screens/DetalleEventoScreen';
import CalendarioScreen from '../screens/CalendarioScreen';
import SeleccionarEquiposScreen from '../screens/SeleccionarEquiposScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Configuración" component={ConfiguracionScreen} />
      <Stack.Screen name="CrearEvento" component={CrearEventoScreen} options={{ title: 'Crear Evento' }} />
      <Stack.Screen name="DetalleEvento" component={DetalleEventoScreen} options={{ title: 'Detalle del Evento' }} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
      <Stack.Screen name="SeleccionarEquipos" component={SeleccionarEquiposScreen} options={{ title: 'Equipos' }}/>
    </Stack.Navigator>
  );
}