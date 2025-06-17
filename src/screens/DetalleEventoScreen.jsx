import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

export default function DetalleEventoScreen({ route }) {
  const {
    event,
    location,
    description,
    tipoActividad,
    deporte,
    jugadores,
    suplentes,
    numEquipos,
    fechaInicio,
    fechaFin,
  } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{event}</Text>

        <Text style={styles.label}>📅 Fecha de inicio: {fechaInicio}</Text>

        {fechaFin ? (
          <Text style={styles.label}>🏁 Fecha de finalización: {fechaFin}</Text>
        ) : null}

        <Text style={styles.label}>📍 Lugar: {location}</Text>
        <Text style={styles.label}>🏷️ Tipo: {tipoActividad}</Text>
        <Text style={styles.label}>🏅 Deporte: {deporte}</Text>
        <Text style={styles.label}>👥 Jugadores por equipo: {jugadores}</Text>
        <Text style={styles.label}>🪑 Suplentes por equipo: {suplentes}</Text>

        {tipoActividad === 'campeonato' && (
          <>
            <Text style={styles.label}>🏆 Número de equipos: {numEquipos}</Text>
          </>
        )}

        <Text style={styles.label}>📝 Descripción:</Text>
        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7e22ce', // morado similar a 'text-purple-700'
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#374151', // gris similar a 'text-gray-700'
    marginBottom: 8,
  },
});