import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { AmistadContext } from '../context/AmistadContext';
import { AuthContext } from '../context/AuthContext';

export default function FriendsScreen() {
  const { amigos, cargarAmigos, encontrarUsuarioPorCorreo, enviarSolicitudPorId} = useContext(AmistadContext);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState()
  const [correoNuevo, setCorreoNuevo] = useState('');

  useEffect(() => {
    cargarAmigos();
  }, []);

  const agregarAmigo = async (id) => {
    await enviarSolicitudPorId(id);
    Alert.alert("Solicitud enviada correctamente");
    setCorreoNuevo('');
    setUsuarioEncontrado(null);
  };

  const buscarUsuarioPorCorreo = async () => {
    if (!correoNuevo.trim()) {
      return;
    }
    const res = await encontrarUsuarioPorCorreo(correoNuevo);
    setUsuarioEncontrado(res)
    console.log(res)
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

      
      {usuarioEncontrado && (
        <View style={{ marginVertical: 16, padding: 12, borderWidth: 1, borderColor: '#1D4ED8', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{usuarioEncontrado.nombre}</Text>
          <Text style={{ color: '#555', marginBottom: 8 }}>{usuarioEncontrado.correo}</Text>
          <Button title="Enviar solicitud de amistad" onPress={() => agregarAmigo(usuarioEncontrado.id)} />
          <View style={{ height: 8 }} />
          <Button title="Buscar otro usuario" color="#888" onPress={() => { setUsuarioEncontrado(null); setCorreoNuevo(''); }} />
        </View>
      )}

      <Text style={styles.subtitle}>Agregar nuevo amigo por correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo del amigo"
        value={correoNuevo}
        onChangeText={setCorreoNuevo}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Buscar amigo" onPress={buscarUsuarioPorCorreo} />
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