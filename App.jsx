import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator'
import { EventoProvider } from './src/context/EventoContext';
import { AmistadProvider } from './src/context/AmistadContext';
import AuthStack from './src/navigation/AuthStack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import 'react-native-gesture-handler';
import { useContext } from 'react';

function AppContent() {
  const { usuario } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {usuario ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AmistadProvider>
        <EventoProvider>
            <AppContent />
        </EventoProvider>
      </AmistadProvider>
    </AuthProvider>
  );
}