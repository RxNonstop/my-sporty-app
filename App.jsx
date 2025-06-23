import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator'
import { EventoProvider } from './src/context/EventoContext';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <EventoProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </EventoProvider>
  );
}