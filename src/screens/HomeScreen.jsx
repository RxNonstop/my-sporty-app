import { useContext, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Pressable } from "react-native";
import { CampeonatoContext } from "../context/CampeonatoContext";
import EventCard from "../components/EventCard";
import SkeletonCard from "../components/SkeletonCard";

export default function HomeScreen({ navigation }) {
  const { campeonatosPublicos, loading } = useContext(CampeonatoContext);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View className="pt-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        )}

        {campeonatosPublicos && campeonatosPublicos.length > 0 ? (
          <View className="pt-2">
            {campeonatosPublicos.map((campeonato) => (
              <EventCard
                key={campeonato.id}
                evento={campeonato}
                onPress={() => {
                  console.log("Campeonato seleccionado:", campeonato.id);
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
