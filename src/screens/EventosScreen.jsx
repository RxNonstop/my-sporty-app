import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { CampeonatoContext } from "../context/CampeonatoContext";
import { ThemeContext } from "../context/ThemeContext";
import EventCard from "../components/EventCard";

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

  return (
    <View className="flex-1 bg-[#fafafa] dark:bg-neutral-900 ">
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            key={item.id}
            evento={item}
            onPress={() =>
              navigation.navigate("FasesCampeonatoScreen", {
                campeonato: item,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8 mt-10">
            <Text className="text-center text-[#8a8a8a] dark:text-neutral-500 text-sm">
              No tienes campeonatos creados.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default EventosScreen;
