import { Container } from 'postcss';
import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet } from 'react-native';

export default function PerfilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mb-6">
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Nombre de Usuario</Text>
          <Text style={styles.email}>usuario@email.com</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Información:</Text>
          <Text>Deportes favoritos: Fútbol, Baloncesto</Text>
          <Text>Eventos creados: 5</Text>
          <Text>Campeonatos participados: 3</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  profileContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 128, height: 128, borderRadius: 64, marginBottom: 12 },
  username: { fontSize: 20, fontWeight: 'bold', color: '#1D4ED8' }, // azul
  email: { color: '#6B7280' }, // gris
  infoContainer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 24, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' },
});