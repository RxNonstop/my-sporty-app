import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { CampeonatoContext } from "../context/CampeonatoContext";
import { ThemeContext } from "../context/ThemeContext";

const EventosScreen = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const { misCampeonatos } = useContext(CampeonatoContext);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const campeonatosBorrador = misCampeonatos.filter(
      (c) => c.estado === "borrador",
    );
    setEvents(campeonatosBorrador);
  }, [misCampeonatos]);

  const EventItem = ({ event }) => (
    <TouchableOpacity
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-3"
      onPress={() =>
        navigation.navigate("FasesCampeonatoScreen", { campeonato: event })
      }
    >
      <Text className="text-blue-600 dark:text-blue-400 text-lg font-bold capitalize">
        {event.deporte}
      </Text>
      <Text className="text-base text-gray-900 dark:text-white mt-1.5 mb-1.5 capitalize">
        {event.nombre}
      </Text>
      <Text className="text-sm text-gray-700 dark:text-gray-300 capitalize">
        Descripcion: {event.descripcion}
      </Text>
      <Text className="text-sm text-gray-700 dark:text-gray-300">
        Numero minimo de equipos: {event.numero_equipos}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Mis campeonatos creados
      </Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem event={item} />}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No tienes misCampeonatos creados.
          </Text>
        }
      />
    </View>
  );
};

export default EventosScreen;
