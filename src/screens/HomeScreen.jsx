// import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, Button } from 'react-native';

// export default function HomeScreen({navigation}) {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <Text>¡Bienvenido!</Text>

//         <Button title="Perfil" onPress={() => navigation.navigate('Perfil')} />
//         <Button title="Configuración" onPress={() => navigation.navigate('Configuración')} />
//         <Button title="Crear Evento" onPress={() => navigation.navigate('CrearEvento')} />
//         <Button title="Calendario" onPress={() => navigation.navigate('Calendario')} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
// src/screens/HomeScreen.js
import { useContext, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { CampeonatoContext } from "../context/CampeonatoContext";
import EventCard from "../components/EventCard";
import SkeletonCard from "../components/SkeletonCard";

export default function HomeScreen({ navigation }) {
  const {
    campeonatosPublicos,
    getCampeonatosPublicos: getCampeonatosPublicosFromContext,
    setCampeonatosPublicos,
  } = useContext(CampeonatoContext);

  const [loading, setLoading] = useState(false);

  const getCampeonatosPublicos = async () => {
    try {
      setLoading(true);

      const data = await getCampeonatosPublicosFromContext();
      setCampeonatosPublicos(data);
    } catch (error) {
      console.error("Error al obtener campeonatos públicos:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 py-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            ¡Bienvenido!
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Explora los campeonatos públicos disponibles
          </Text>
        </View>

        <View className="px-4 py-3 flex-row gap-3">
          <Text
            title="Actualizar campeonatos"
            onClick={async () => await getCampeonatosPublicos()}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            Actualizar campeonatos
          </Text>
        </View>

        {loading && (
          <View className="pt-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        )}

        {/* Listado de campeonatos */}
        {campeonatosPublicos && campeonatosPublicos.length > 0 ? (
          <View className="pt-2">
            {campeonatosPublicos.map((campeonato) => (
              <EventCard
                key={campeonato.id}
                evento={campeonato}
                onPress={() => {
                  // Aquí puedes navegar a los detalles del campeonato
                  console.log("Campeonato seleccionado:", campeonato.id);
                  // navigation.navigate("DetalleEvento", { id: campeonato.id });
                }}
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center px-8 min-h-[300px]">
            <Text className="text-base text-gray-600 dark:text-gray-400 text-center font-medium">
              No hay campeonatos públicos disponibles en este momento.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
