import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { CampeonatoContext } from '../context/CampeonatoContext';

// Simulación de datos
// const mockEvents = [
//   {
//     id: '1',
//     type: 'Partido',
//     name: 'Fútbol 5 - Domingo',
//     date: '2025-08-22',
//     location: 'Parque Central',
//   },
//   {
//     id: '2',
//     type: 'Campeonato',
//     name: 'Torneo de Verano',
//     date: '2025-09-01',
//     location: 'Complejo Deportivo',
//   },
// ];

const EventosScreen = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const { campeonatos, getCampeonatos } = useContext(CampeonatoContext);

  useEffect(() => {
    getCampeonatos();
    
  }, []);

  useEffect(() => {
    const campeonatosBorrador = campeonatos.filter(c => c.estado === "borrador");
    setEvents(campeonatosBorrador);
  }, [campeonatos]);

  const EventItem = ({ event }) => (
  <TouchableOpacity style={styles.item}
  onPress={() => navigation.navigate('FasesCampeonatoScreen', { campeonato: event })}>
    <Text style={styles.eventName}>{event.nombre}</Text>
    <Text style={styles.eventType}>{event.deporte}</Text>
    <Text style={styles.eventInfo}>Descripcion: {event.descripcion}</Text>
    <Text style={styles.eventInfo}>Numero minimo de equipos: { event.numero_equipos}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis campeonatos creados</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem event={item} />}
        ListEmptyComponent={<Text>No tienes campeonatos creados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
  },
  eventType: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  eventName: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 6,
  },
  eventInfo: {
    fontSize: 14,
    color: '#333',
  },
});

export default EventosScreen;

