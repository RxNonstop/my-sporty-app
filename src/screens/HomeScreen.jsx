import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, Button } from 'react-native';

export default function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text>¡Bienvenido!</Text>

        <Button title="Perfil" onPress={() => navigation.navigate('Perfil')} />
        <Button title="Configuración" onPress={() => navigation.navigate('Configuración')} />
        <Button title="Crear Evento" onPress={() => navigation.navigate('CrearEvento')} />
        <Button title="Calendario" onPress={() => navigation.navigate('Calendario')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});