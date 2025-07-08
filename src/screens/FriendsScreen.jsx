import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost/api-DeportProyect/api/index.php'; // cámbialo a 10.0.2.2 si usas emulador Android

export default function FriendsScreen() {
  const { usuario } = useContext(AuthContext);
  const [amigos, setAmigos] = useState([]);
  const [correoNuevo, setCorreoNuevo] = useState('');

  const cargarAmigos = async () => {
    try {
    //   const res = await axios.get(`${API_URL}/amigos/${usuario.id}`);
      setAmigos(res.data.amigos || []);
    } catch (err) {
      console.error('Error cargando amigos', err);
    }
  };

  const agregarAmigo = async () => {
    if (!correoNuevo.trim()) return Alert.alert('Error', 'Ingresa un correo válido');

    try {
      const res = await axios.post(`${API_URL}/amigos`, {
        usuario_id: usuario.id,
        correo: correoNuevo
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      Alert.alert('Éxito', res.data.message || 'Amigo agregado');
      setCorreoNuevo('');
      cargarAmigos();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'No se pudo agregar');
    }
  };

  useEffect(() => {
    if (usuario) cargarAmigos();
  }, [usuario]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus amigos</Text>

      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.nombre} - {item.correo}</Text>}
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
      <Button title="Agregar Amigo" onPress={agregarAmigo} />
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