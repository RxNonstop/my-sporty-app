import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { AmistadContext } from '../context/AmistadContext';
import { EquipoContext } from '../context/EquipoContext'; 
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';


export default function CrearEquipoScreen({ navigation }) {
  const {amigos, cargarAmigos} = useContext(AmistadContext)
  const {createEquipo} = useContext(EquipoContext);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [deporte, setDeporte] = useState('futbol');
  const [seleccionados, setSeleccionados] = useState([]);
  const { isDarkMode } = useContext(ThemeContext);

console.log(amigos)
  const deportes = [
              { label: "Fútbol", value: "futbol" },
              { label: "Baloncesto", value: "baloncesto" },
              { label: "Béisbol", value: "beisbol" },
              { label: "Voleibol", value: "voleibol" },
            ];
console.log(deporte)
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
    <View className="p-5">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4, borderRadius: 999 }}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1a1a1a] dark:text-white flex-1" numberOfLines={1}>
          Crear equipo
        </Text>
      </View>

      {/* 
      <TextInput
        style={styles.input}
        placeholder="Nombre del equipo"
        value={nombreEquipo}
        onChangeText={setNombreEquipo}
      /> */}
      
      <Text style={styles.label}>Nombre:</Text>
      <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-4 border border-gray-100 dark:border-neutral-700 shadow-sm">
        <TextInput
          placeholder="Nombre del equipo..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 h-12 ml-2 text-base text-gray-900 dark:text-white"
          value={nombreEquipo}
          onChangeText={setNombreEquipo}
        />
      </View>

      <Text style={styles.label}>Deporte:</Text>
      <View style={styles.row}>
        {deportes.map((dep) => (
          <TouchableOpacity
            key={dep.value}
            style={[styles.option, deporte === dep.value && styles.selected]}
            onPress={() => setDeporte(dep.value)}
          >
            <Text>{dep.label}</Text>
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

      {/* <Button title="Crear Equipo" onPress={crearNuevoEquipo} /> */}
      <TouchableOpacity
        onPress={crearNuevoEquipo}
        className="flex-row py-3 px-3 rounded-xl border bg-blue-600 border-blue-600 dark:border-gray-300 dark:border-gray-700 justify-center items-center"
      >
        <Text className="text-md font-medium text-white dark:text-gray-700 dark:text-gray-300">
          Crear equipo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1D4ED8' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12
  },
  label: { marginTop: 16, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12, marginTop: 6, alignSelf: 'center'},
  option: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 0.5, borderRadius: 8, borderColor: '#cccccc'
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