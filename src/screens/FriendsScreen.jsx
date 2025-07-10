import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { AmistadContext } from '../context/AmistadContext';
import { AuthContext } from '../context/AuthContext';
import { enviarSolicitud } from '../services/amistadService';

export default function FriendsScreen() {
  const { amigos, cargarAmigos } = useContext(AmistadContext);
  const { usuario } = useContext(AuthContext);
  const [correoNuevo, setCorreoNuevo] = useState('');

  useEffect(() => {
    cargarAmigos();
  }, []);

  const agregarAmigo = async () => {
    if (!correoNuevo.trim()) {
      return Alert.alert('Error', 'Ingresa un correo válido');
    }

    try {
      // Aquí tú puedes hacer una búsqueda en tu API para obtener el ID del usuario por correo.
      // Como no hay un endpoint de búsqueda por correo en el controller que me diste,
      // supongamos que tú ya tienes la lógica para obtenerlo en la app (debes implementar eso en backend si no existe).
      // Aquí por ejemplo simulamos un ID por defecto:
      const para_usuario_id = await buscarUsuarioPorCorreo(correoNuevo);

      await enviarSolicitud(para_usuario_id);
      Alert.alert('Éxito', 'Solicitud de amistad enviada');
      setCorreoNuevo('');
      cargarAmigos();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.message || 'No se pudo agregar');
    }
  };

  const buscarUsuarioPorCorreo = async (correo) => {
    // Simulación temporal. Deberías tener un endpoint como GET /usuarios?correo=
    throw new Error('Debe implementarse un endpoint para buscar por correo.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus amigos</Text>

      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.nombre} - {item.correo}</Text>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tienes amigos todavía</Text>}
      />

      <Text style={styles.subtitle}>Agregar nuevo amigo por correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo del amigo"
        value={correoNuevo}
        onChangeText={setCorreoNuevo}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Enviar solicitud" onPress={agregarAmigo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1D4ED8' },
  subtitle: { marginTop: 20, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginTop: 8, marginBottom: 12
  },
  item: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  empty: { fontStyle: 'italic', color: '#888', marginTop: 20 },
});