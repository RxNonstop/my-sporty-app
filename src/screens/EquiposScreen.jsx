import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EquipoContext } from '../context/EquipoContext';

export default function EquiposScreen() {
  const { equipos, getEquipos, deleteEquipo } = useContext(EquipoContext);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        await getEquipos();
      } catch (err) {
        console.error('Error cargando equipos', err);
      }
    };
    cargarEquipos();
  },[])

  const confirmarEliminar = async (id) => {
    // Alert.alert(
    //   '¿Eliminar equipo?',
    //   'Esta acción no se puede deshacer',
    //   [
    //     { text: 'Cancelar', style: 'cancel' },
    //     {
    //       text: 'Eliminar',
    //       style: 'destructive',
    //       onPress: async () => {
    //         await deleteEquipo(id);
    //         // cargarEquipos();
    //       },
    //     },
    //   ]
    // );
    await deleteEquipo(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text>Deporte: {item.deporte}</Text>
      <Text>Miembros: {item.miembros?.length || 0}</Text>

      <View style={styles.actions}>
        <Button
          title="Editar"
          onPress={() => navigation.navigate('EditarEquipoScreen', { equipo: item })}
        />
        <Button
          title="Invitar"
          onPress={() => navigation.navigate('InvitarAmigosScreen', { equipoId: item.id })}
        />
        <Button
          title="Eliminar"
          color="red"
          onPress={() => confirmarEliminar(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Equipos</Text>
      <FlatList
        data={equipos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No tienes equipos aún</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CrearEquipo')}
      >
        <Text style={styles.addButtonText}>+ Crear Equipo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1D4ED8' },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  nombre: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  empty: { fontStyle: 'italic', textAlign: 'center', marginTop: 40, color: '#888' },
  addButton: {
    backgroundColor: '#1D4ED8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});