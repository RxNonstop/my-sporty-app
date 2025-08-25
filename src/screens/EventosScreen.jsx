import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Simulación de datos
const mockEvents = [
  {
    id: '1',
    type: 'Partido',
    name: 'Fútbol 5 - Domingo',
    date: '2025-08-22',
    location: 'Parque Central',
  },
  {
    id: '2',
    type: 'Campeonato',
    name: 'Torneo de Verano',
    date: '2025-09-01',
    location: 'Complejo Deportivo',
  },
];

const EventosScreen = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Aquí podrías hacer una petición a tu API para obtener los eventos creados por el usuario
    // Ejemplo: fetchUserEvents().then(setEvents);
    setEvents(mockEvents);
  }, []);

  const EventItem = ({ event }) => (
  <TouchableOpacity style={styles.item}
  onPress={() => navigation.navigate('FasesCampeonatoScreen', { campeonato: event })}>
    <Text style={styles.eventType}>{event.type}</Text>
    <Text style={styles.eventName}>{event.name}</Text>
    <Text style={styles.eventInfo}>Fecha: {event.date}</Text>
    <Text style={styles.eventInfo}>Lugar: { event.location}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis eventos creados</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem event={item} />}
        ListEmptyComponent={<Text>No tienes eventos creados.</Text>}
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

