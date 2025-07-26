import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { AmistadContext } from '../context/AmistadContext';
import { EquipoContext } from '../context/EquipoContext'; 
import { useNavigation } from '@react-navigation/native';


export default function CrearEquipoScreen() {
  const {amigos, cargarAmigos} = useContext(AmistadContext)
  const {createEquipo} = useContext(EquipoContext);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [deporte, setDeporte] = useState('futbol');
  const [seleccionados, setSeleccionados] = useState([]);

  const navigation = useNavigation();

  const deportes = ['futbol', 'beisbol', 'voleibol'];

  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        await cargarAmigos();
      } catch (error) {
        console.error(error);
      }
    };
    fetchAmigos();
  }, []);

  // const toggleSeleccion = (id) => {
  //   if (seleccionados.includes(id)) {
  //     setSeleccionados(seleccionados.filter((e) => e !== id));
  //   } else {
  //     setSeleccionados([...seleccionados, id]);
  //   }
  // };

  const crearNuevoEquipo = async () => {
    if (!nombreEquipo.trim()) {
      return Alert.alert('Error', 'Debes ingresar un nombre para el equipo');
    }

    // if (seleccionados.length === 0) {
    //   return Alert.alert('Error', 'Selecciona al menos un amigo para el equipo');
    // }

    try {
      await createEquipo(nombreEquipo, deporte)
      setNombreEquipo('');
      setSeleccionados([]);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'No se pudo crear el equipo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear equipo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del equipo"
        value={nombreEquipo}
        onChangeText={setNombreEquipo}
      />

      <Text style={styles.label}>Deporte:</Text>
      <View style={styles.row}>
        {deportes.map((dep) => (
          <TouchableOpacity
            key={dep}
            style={[styles.option, deporte === dep && styles.selected]}
            onPress={() => setDeporte(dep)}
          >
            <Text>{dep}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* <Text style={styles.label}>Selecciona miembros:</Text>
      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const seleccionado = seleccionados.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.amigo, seleccionado && styles.amigoSeleccionado]}
              onPress={() => toggleSeleccion(item.id)}
            >
              <Text style={styles.amigoNombre}>{item.nombre}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No tienes amigos disponibles</Text>}
      /> */}

      <Button title="Crear Equipo" onPress={crearNuevoEquipo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1D4ED8' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12
  },
  label: { marginTop: 16, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12, marginTop: 6 },
  option: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderRadius: 8, borderColor: '#ccc'
  },
  selected: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' },
  amigo: {
    padding: 10, borderWidth: 1, borderRadius: 8,
    borderColor: '#ccc', marginBottom: 6
  },
  amigoSeleccionado: { backgroundColor: '#A7F3D0', borderColor: '#10B981' },
  amigoNombre: { fontSize: 16 },
  empty: { color: '#888', fontStyle: 'italic', marginTop: 16 }
});