import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { EventoContext } from '../context/EventoContext';

const EQUIPOS_DISPONIBLES = [
  { id: '1', nombre: 'Tigres FC' },
  { id: '2', nombre: 'Águilas Doradas' },
  { id: '3', nombre: 'Leones Rojos' },
  { id: '4', nombre: 'Toros del Sur' },
  { id: '5', nombre: 'Dragones Verdes' },
  { id: '6', nombre: 'Halcones Azules' },
];

export default function SeleccionarEquiposScreen({ route, navigation }) {
  const { eventoBase, numEquipos } = route.params;
  const { agregarEvento } = useContext(EventoContext);
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleEquipo = (equipo) => {
    if (seleccionados.find((e) => e.id === equipo.id)) {
      setSeleccionados(seleccionados.filter((e) => e.id !== equipo.id));
    } else if (seleccionados.length < numEquipos) {
      setSeleccionados([...seleccionados, equipo]);
    }
  };

  const handleCrear = () => {
    if (seleccionados.length !== numEquipos) {
      Alert.alert('Error', `Debes seleccionar exactamente ${numEquipos} equipos`);
      return;
    }

    const eventoConEquipos = {
      ...eventoBase,
      equipos: seleccionados,
    };

    agregarEvento(eventoBase.fechaInicio, eventoConEquipos);
    navigation.navigate('Calendario');
  };

  const renderItem = ({ item }) => {
    const seleccionado = seleccionados.find((e) => e.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.row, seleccionado && styles.selectedRow]}
        onPress={() => toggleEquipo(item)}
      >
        <Text style={styles.rowText}>{item.nombre}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona {numEquipos} equipos</Text>
      <FlatList
        data={EQUIPOS_DISPONIBLES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.submit}>
        <Button title="Crear Campeonato" onPress={handleCrear} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1D4ED8' },
  row: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedRow: {
    backgroundColor: '#A7F3D0',
    borderColor: '#10B981',
  },
  rowText: {
    fontSize: 16,
    color: '#111827',
  },
  submit: {
    marginTop: 16,
  },
});