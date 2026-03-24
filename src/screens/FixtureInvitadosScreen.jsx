import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FixtureInvitadosScreen = ({ route }) => {
  // Asumiendo que los equipos invitados se pasan como parámetro desde invitacionEquipoScreen
  const { equiposInvitados } = route.params || { equiposInvitados: [] };

  // Ejemplo de fixture: generar partidos aleatorios entre equipos invitados
  const generarFixture = (equipos) => {
    const fixture = [];
    for (let i = 0; i < equipos.length; i += 2) {
      if (i + 1 < equipos.length) {
        fixture.push({
          id: i,
          equipo1: equipos[i],
          equipo2: equipos[i + 1],
          fecha: `Fecha ${Math.floor(i / 2) + 1}`,
        });
      }
    }
    return fixture;
  };

  const fixture = generarFixture(equiposInvitados);

  const renderItem = ({ item }) => (
    <View style={styles.matchContainer}>
      <Text style={styles.matchText}>
        {item.equipo1} vs {item.equipo2}
      </Text>
      <Text style={styles.dateText}>{item.fecha}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fixture de Equipos Invitados</Text>
      {fixture.length > 0 ? (
        <FlatList
          data={fixture}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text>No hay suficientes equipos para generar un fixture.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  matchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  matchText: {
    fontSize: 18,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
});

export default FixtureInvitadosScreen;