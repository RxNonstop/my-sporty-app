import React, { useState, useContext } from "react";
import { View, Text, Switch, SafeAreaView, ScrollView } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function ConfiguracionScreen() {
  const [notificaciones, setNotificaciones] = useState(true);
  const { isDarkMode, toggleTema } = useContext(ThemeContext);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">
          Configuración
        </Text>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base text-gray-700 dark:text-gray-300">
            Notificaciones
          </Text>
          <Switch value={notificaciones} onValueChange={setNotificaciones} />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base text-gray-700 dark:text-gray-300">
            Tema oscuro
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleTema} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
