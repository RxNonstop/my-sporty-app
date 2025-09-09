import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EventoContext } from '../context/EventoContext';
import { CampeonatoContext } from '../context/CampeonatoContext';
import { useNavigation } from '@react-navigation/native';

export default function CrearEventoScreen() {
  const { agregarEvento } = useContext(EventoContext);
  const { agregarCampeonato } = useContext(CampeonatoContext);
  const navigation = useNavigation();

  const [event, setEvent] = useState('');
  const [location, setLocation] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoActividad, setTipoActividad] = useState('partido');
  const [privacidad, setPrivacidad] = useState('publico');
  const [deporte, setDeporte] = useState('Fútbol');
  const [jugadores, setJugadores] = useState('');
  const [suplentes, setSuplentes] = useState('');
  const [numEquipos, setNumEquipos] = useState('');

  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [mostrarInicio, setMostrarInicio] = useState(false);
  const [mostrarFin, setMostrarFin] = useState(false);

  const handleContinuar = () => {
    const formattedInicio = fechaInicio.toISOString().split('T')[0];
    const formattedFin = fechaFin.toISOString().split('T')[0];

    if (!event  || !formattedInicio) {
      return alert('Nombre, Lugar y Fecha de inicio son obligatorios');
    }

    const eventoData = {
      nombre: event,
      location,
      descripcion,
      dotColor: deporte === 'Fútbol' ? 'green' : deporte === 'Béisbol' ? 'blue' : 'orange',
      tipoActividad,
      deporte,
      inscripciones_abiertas: privacidad === 'privado' ? 1 : 0,
      numero_jugadores: jugadores,
      numero_suplentes: suplentes,
      numero_equipos: numEquipos,
      fechaFin: tipoActividad === 'campeonato' ? formattedFin : null,
      fechaInicio: formattedInicio,
    };

    if (tipoActividad === 'campeonato') {
      if (!numEquipos || isNaN(numEquipos)) {
        return alert('Número de equipos inválido');
      }
      agregarCampeonato(eventoData);
      setEvent('');
      setLocation('');
      setDescripcion('');
      setTipoActividad('partido');
      setPrivacidad('publico');
      setDeporte('Fútbol');
      setJugadores('');
      setSuplentes('');
      setNumEquipos('');
      setFechaInicio(new Date());
      setFechaFin(new Date());
      // navigation.navigate('SeleccionarEquipos', {
      //   eventoBase: eventoData,
      //   numEquipos: parseInt(numEquipos),
      // });
      alert('Campeonato creado exitosamente');
      navigation.navigate('Inicio');
    } else {
      agregarCampeonato(eventoData);
      navigation.navigate('Calendario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo {tipoActividad === 'campeonato' ? 'Campeonato' : 'Partido'}</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={event} onChangeText={setEvent} />
      {/* <TextInput placeholder="Lugar" style={styles.input} value={location} onChangeText={setLocation} /> */}
      <TextInput placeholder="Descripción" style={styles.input} value={descripcion} onChangeText={setDescripcion} />

      <View style={styles.row}>
        <View style={styles.fieldRow}>
          <Text style={styles.label}>Tipo de Actividad:</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setTipoActividad('partido')} style={[styles.option, tipoActividad === 'partido' && styles.selected]}>
              <Text>Partido</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTipoActividad('campeonato')} style={[styles.option, tipoActividad === 'campeonato' && styles.selected]}>
              <Text>Campeonato</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Privacidad: </Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setPrivacidad('publico')} style={[styles.option, privacidad === 'publico' && styles.selected]}>
              <Text>Público</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPrivacidad('privado')} style={[styles.option, privacidad === 'privado' && styles.selected]}>
              <Text>Privado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.label}>Deporte:</Text>
      <View style={styles.row}>
        {['Fútbol', 'Baloncesto', 'Béisbol'].map((dep) => (
          <TouchableOpacity key={dep} onPress={() => setDeporte(dep)} style={[styles.option, deporte === dep && styles.selected]}>
            <Text>{dep}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput placeholder="N.º de jugadores" style={styles.input} keyboardType="numeric" value={jugadores} onChangeText={setJugadores} />
      <TextInput placeholder="N.º de suplentes" style={styles.input} keyboardType="numeric" value={suplentes} onChangeText={setSuplentes} />
      {tipoActividad === 'campeonato' && (
        <TextInput placeholder="N.º de equipos" style={styles.input} keyboardType="numeric" value={numEquipos} onChangeText={setNumEquipos} />
      )}

      <Text style={styles.label}>Fecha de inicio:</Text>
      <Button title={fechaInicio.toDateString()} onPress={() => setMostrarInicio(true)} />
      {mostrarInicio && (
        <DateTimePicker
          value={fechaInicio}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, date) => {
            setMostrarInicio(false);
            if (date) setFechaInicio(date);
          }}
        />
      )}

      {tipoActividad === 'campeonato' && (
        <>
          <Text style={styles.label}>Fecha de finalización:</Text>
          <Button title={fechaFin.toDateString()} onPress={() => setMostrarFin(true)} />
          {mostrarFin && (
            <DateTimePicker
              value={fechaFin}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(_, date) => {
                setMostrarFin(false);
                if (date) setFechaFin(date);
              }}
            />
          )}
        </>
      )}

      <View style={styles.submit}>
        <Button title={tipoActividad === 'campeonato' ? 'Siguiente' : 'Crear Evento'} onPress={handleContinuar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1D4ED8' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12,
  },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '600', fontSize: 16 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  fieldRow: {  width: '48%' },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#93C5FD',
    borderColor: '#3B82F6',
  },
  submit: { marginTop: 16 },
});