import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost/api-DeportProyect/api/index.php'; // o 10.0.2.2 si usas emulador Android

export default function NotificacionesScreen() {
  const { usuario } = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarNotificaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/notificaciones/${usuario.id}`);
      setNotificaciones(res.data || []);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarNotificaciones();
    }
  }, [usuario]);

  const renderItem = ({ item }) => (
    <View style={[styles.notificacion, !item.leida && styles.noLeida]}>
      <Text style={styles.mensaje}>{item.mensaje}</Text>
      <Text style={styles.fecha}>{new Date(item.fecha).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Notificaciones</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={notificaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No tienes notificaciones.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1D4ED8', marginBottom: 16 },
  notificacion: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 10
  },
  noLeida: {
    backgroundColor: '#DBEAFE',
  },
  mensaje: {
    fontSize: 16,
    marginBottom: 4
  },
  fecha: {
    fontSize: 12,
    color: '#6B7280'
  },
  empty: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  }
});