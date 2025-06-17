import React, { useState } from 'react';
import { View, Text, Switch, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function ConfiguracionScreen() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [temaOscuro, setTemaOscuro] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Configuración</Text>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Notificaciones</Text>
          <Switch
            value={notificaciones}
            onValueChange={setNotificaciones}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Tema oscuro</Text>
          <Switch
            value={temaOscuro}
            onValueChange={setTemaOscuro}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1D4ED8', marginBottom: 16 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: { fontSize: 16, color: '#374151' },
});