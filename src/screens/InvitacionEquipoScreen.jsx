import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AmistadContext } from '../context/AmistadContext';
import { EquipoContext } from '../context/EquipoContext';

export default function InvitarAmigosScreen() {
  const { amigos, cargarAmigos } = useContext(AmistadContext);
  const { enviarInvitacion } = useContext(EquipoContext);
  const [enviando, setEnviando] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { equipoId } = route.params;

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarAmigos();
    };
    cargarDatos();
  },[]);

  const enviarInvitacionAEquipo = async (amigoId) => {
    try {
        setEnviando(amigoId);
        await enviarInvitacion(amigoId, equipoId);
        Alert.alert('Invitación enviada', 'Se ha enviado la invitación correctamente');
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo enviar la invitación');
    } finally {
        setEnviando(null);
    }
  };

  const renderAmigo = ({ item }) => (
    <View style={styles.amigoContainer}>
      <Text style={styles.amigoNombre}>{item.nombre}</Text>
      <Button
        title={enviando === item.id ? 'Enviando...' : 'Invitar'}
        onPress={() => enviarInvitacionAEquipo(item.id)}
        disabled={enviando === item.id}
        color="#1E40AF"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAmigo}
        ListEmptyComponent={<Text>No tienes amigos disponibles</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1E40AF' },
  amigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  amigoNombre: { fontSize: 16 },
});