import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const generateLigaFixture = (teams) => {
  // Liga: todos contra todos
  const fixture = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixture.push({
        match: `${teams[i]} vs ${teams[j]}`,
        round: 'Fase de Liga',
      });
    }
  }
  return fixture;
};

const generateEliminatoriaFixture = (teams) => {
  // Eliminatoria: emparejamientos directos
  const fixture = [];
  if (teams.length % 2 !== 0) {
    teams.push('Descanso');
  }
  for (let i = 0; i < teams.length; i += 2) {
    fixture.push({
      match: `${teams[i]} vs ${teams[i + 1]}`,
      round: 'Eliminatoria',
    });
  }
  return fixture;
};

const FasesCampeonatoScreen = ({ route }) => {
  const { campeonato } = route.params || {};
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [method, setMethod] = useState('');
  const [fixture, setFixture] = useState([]);

  const addTeam = () => {
    if (!newTeam.trim()) return;
    setTeams([...teams, newTeam.trim()]);
    setNewTeam('');
  };

  const handleGenerateFixture = () => {
    if (teams.length < 2) {
      Alert.alert('Agrega al menos dos equipos');
      return;
    }
    let f;
    if (method === 'liga') f = generateLigaFixture(teams);
    else if (method === 'eliminatoria') f = generateEliminatoriaFixture(teams);
    else {
      Alert.alert('Selecciona un método de fixture');
      return;
    }
    setFixture(f);
  };

  if (!campeonato) {
    return <Text>No se encontró el campeonato.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{campeonato?.name || "Sin nombre"}</Text>
      <Text style={styles.subtitle}>Agregar equipos participantes:</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newTeam}
          onChangeText={setNewTeam}
          placeholder="Nombre del equipo"
        />
        <Button title="Agregar" onPress={addTeam} />
      </View>

      <FlatList
        data={teams}
        keyExtractor={(item, idx) => item + idx}
        renderItem={({ item }) => (
          <Text style={styles.teamItem}>{item}</Text>
        )}
        ListEmptyComponent={<Text>No hay equipos agregados aún.</Text>}
      />

      <Text style={styles.subtitle}>Selecciona método de fixture:</Text>
      <View
        style={styles.buttonRow}
      >
        <TouchableOpacity
          style={[
            styles.selectButton,
            method === 'liga' && styles.selectedButton,
          ]}
          onPress={() => setMethod('liga')}
        >
          <Text>Liga</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectButton,
            method === 'eliminatoria' && styles.selectedButton,
          ]}
          onPress={() => setMethod('eliminatoria')}
        >
          <Text>Eliminatoria</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Generar Fixture"
        onPress={handleGenerateFixture}
        disabled={teams.length < 2 || !method}
      />

      {fixture.length > 0 && (
        <>
          <Text style={styles.subtitle}>Fixture generado:</Text>
          <FlatList
            data={fixture}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Text style={styles.fixtureItem}>
                {item.round}: {item.match}
              </Text>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 18, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  teamItem: { fontSize: 15, paddingVertical: 3 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  selectButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  selectedButton: { backgroundColor: '#cce5ff' },
  fixtureItem: { fontSize: 15, marginVertical: 3, color: '#444' },
});

export default FasesCampeonatoScreen;