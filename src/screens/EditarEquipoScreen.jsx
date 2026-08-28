import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { EquipoContext } from '../context/EquipoContext'; 
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';

export default function EditarEquipoScreen({ route, navigation }) {
  const { equipo } = route.params;
  const { updateEquipo } = useContext(EquipoContext);
  const [nombreEquipo, setNombreEquipo] = useState(equipo?.nombre || '');
  const [deporte, setDeporte] = useState(equipo?.deporte || 'futbol');
  const { isDarkMode } = useContext(ThemeContext);

  const deportes = [
    { label: "Fútbol", value: "futbol" },
    { label: "Baloncesto", value: "baloncesto" },
    { label: "Béisbol", value: "beisbol" },
    { label: "Voleibol", value: "voleibol" },
  ];

  const guardarCambios = async () => {
    if (!nombreEquipo.trim()) {
      return Alert.alert('Error', 'Debes ingresar un nombre para el equipo');
    }

    try {
      await updateEquipo(equipo.id, nombreEquipo, deporte);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'No se pudo actualizar el equipo');
    }
  };

  return (
    <View className="p-5 gap-3">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4, borderRadius: 999 }}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1a1a1a] dark:text-white flex-1" numberOfLines={1}>
          Editar equipo
        </Text>
      </View>

      <Text className= "text-[#1a1a1a] dark:text-white font-semibold">Nombre:</Text>
      <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-4 border border-gray-100 dark:border-neutral-700 shadow-sm">
        <TextInput
          placeholder="Nombre del equipo..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 h-12 ml-2 text-base text-gray-900 dark:text-white"
          value={nombreEquipo}
          onChangeText={setNombreEquipo}
        />
      </View>

      <Text className= "text-[#1a1a1a] dark:text-white font-semibold">Deporte:</Text>
      <View className="flex-row gap-5 mb-5 self-center">
        {deportes.map((dep) => (
          <TouchableOpacity
            key={dep.value}
            style={[styles.option, deporte === dep.value && styles.selected]}
            onPress={() => setDeporte(dep.value)}
          >
            <Text className="text-[#1a1a1a] dark:text-white">{dep.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={guardarCambios}
        className="flex-row py-3 px-3 rounded-xl border bg-blue-600 border-blue-600 dark:border-gray-300 dark:border-gray-700 justify-center items-center"
      >
        <Text className="text-md font-medium text-white ">
          Guardar Cambios
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 0.5, borderRadius: 8, borderColor: '#cccccc'
  },
  selected: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }
});
