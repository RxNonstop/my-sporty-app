import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Calendar} from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { EventoContext } from '../context/EventoContext';

export default function CalendarioScreen() {
  const { eventos } = useContext(EventoContext);
  const navigation = useNavigation();

  const renderItem = (item) => (
    <TouchableOpacity style={{ height: item.height }} onPress={() => alert(item.name)}>
      <View style={{ flex: 1, backgroundColor: item.color, borderRadius: 5, padding: 10 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: '#fff' }}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleDayPress = (day) => {
    const evento = eventos[day.dateString];
    if (evento) {
      Alert.alert('Evento Deportivo', `Hay un evento llamado ${evento.event} el ${day.dateString}`);
    } else {
      Alert.alert('Sin eventos', `No hay eventos el ${day.dateString}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={eventos}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          dotColor: '#00adf5',
          arrowColor: '#00adf5',
          monthTextColor: '#000',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 12,
  },
  agenda: {
    flex: 1,
  },
});