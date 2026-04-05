import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { AmistadContext } from "../context/AmistadContext";
import { EquipoContext } from "../context/EquipoContext";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export default function MensajesScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { amigos } = useContext(AmistadContext);
  const { yourTeams, otherTeams } = useContext(EquipoContext);
  const { usuario } = useContext(AuthContext);
  const { resumenAmigos, resumenEquipos } = useContext(ChatContext);
  const [activeTab, setActiveTab] = useState("amigos");

  const equiposCombinados = [...yourTeams, ...otherTeams];

  const unreadAmigos = Object.values(resumenAmigos).reduce((acc, curr) => acc + (curr.unread_count || 0), 0);
  const unreadEquipos = Object.values(resumenEquipos).reduce((acc, curr) => acc + (curr.unread_count || 0), 0);

  const renderAmigos = () => {
    if (amigos.length === 0) {
      return (
        <View className="flex-1 items-center justify-center pt-20">
          <Ionicons
            name="people-outline"
            size={64}
            color={isDarkMode ? "#404040" : "#d1d5db"}
          />
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center px-8">
            Aún no tienes amigos agregados. Agrega amigos para empezar a
            chatear.
          </Text>
        </View>
      );
    }

    return amigos.map((amigo) => {
      const elAmigo = amigo;

      return (
        <TouchableOpacity
          key={`amigo-${amigo.id}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: isDarkMode ? "#262626" : "#ffffff",
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? "#404040" : "#f3f4f6",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() =>
            navigation.navigate("ChatRoomScreen", {
              type: "amigo",
              target: elAmigo,
            })
          }
        >
        <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center mr-4">
          <Text className="text-indigo-600 dark:text-indigo-300 font-bold text-lg">
            {elAmigo.nombre?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text className="text-base font-bold text-gray-900 dark:text-gray-100" numberOfLines={1}>
            {elAmigo.nombre}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
            {resumenAmigos[elAmigo.id]?.ultimo_mensaje || `Toca para chatear con ${elAmigo.nombre}`}
          </Text>
        </View>
        
        {resumenAmigos[elAmigo.id]?.unread_count > 0 ? (
          <View style={{ backgroundColor: '#10b981', borderRadius: 999, minWidth: 22, height: 22, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {resumenAmigos[elAmigo.id].unread_count > 99 ? '99+' : resumenAmigos[elAmigo.id].unread_count}
            </Text>
          </View>
        ) : (
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={isDarkMode ? "#9ca3af" : "#6b7280"}
          />
        )}
      </TouchableOpacity>
      );
    });
  };

  const renderEquipos = () => {
    if (equiposCombinados.length === 0) {
      return (
        <View className="flex-1 items-center justify-center pt-20">
          <Ionicons
            name="shield-outline"
            size={64}
            color={isDarkMode ? "#404040" : "#d1d5db"}
          />
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center px-8">
            No perteneces a ningún equipo. Crea o únete a uno para participar en
            el chat grupal.
          </Text>
        </View>
      );
    }

    return equiposCombinados.map((equipo) => (
      <TouchableOpacity
        key={`equipo-${equipo.id}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: isDarkMode ? "#262626" : "#ffffff",
          borderRadius: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: isDarkMode ? "#404040" : "#f3f4f6",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
        onPress={() =>
          navigation.navigate("ChatRoomScreen", {
            type: "equipo",
            target: equipo,
          })
        }
      >
        <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full items-center justify-center mr-4">
          <Ionicons
            name="shield-checkmark"
            size={20}
            color={isDarkMode ? "#34d399" : "#10b981"}
          />
        </View>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text className="text-base font-bold text-gray-900 dark:text-gray-100" numberOfLines={1}>
            {equipo.nombre}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
            {resumenEquipos[equipo.id]?.ultimo_mensaje || "Chat grupal del equipo"}
          </Text>
        </View>
        {resumenEquipos[equipo.id]?.unread_count > 0 ? (
          <View style={{ backgroundColor: '#10b981', borderRadius: 999, minWidth: 22, height: 22, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {resumenEquipos[equipo.id].unread_count > 99 ? '99+' : resumenEquipos[equipo.id].unread_count}
            </Text>
          </View>
        ) : (
          <Ionicons
            name="chatbubbles-outline"
            size={24}
            color={isDarkMode ? "#9ca3af" : "#6b7280"}
          />
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }}
    >
      <View className="px-4 pt-4 pb-2">
        {/* Pestañas (Pills) */}
        <View className="flex-row bg-gray-200 dark:bg-neutral-800 p-1 rounded-xl">
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: activeTab === "amigos" ? (isDarkMode ? "#404040" : "#ffffff") : "transparent",
              shadowColor: activeTab === "amigos" ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeTab === "amigos" ? 0.05 : 0,
              elevation: activeTab === "amigos" ? 1 : 0,
            }}
            onPress={() => setActiveTab("amigos")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text
                className={`font-bold ${activeTab === "amigos" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                Amigos
              </Text>
              {unreadAmigos > 0 && (
                <View style={{ backgroundColor: '#ef4444', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 6, paddingHorizontal: 4 }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{unreadAmigos > 99 ? '99+' : unreadAmigos}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: activeTab === "equipos" ? (isDarkMode ? "#404040" : "#ffffff") : "transparent",
              shadowColor: activeTab === "equipos" ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeTab === "equipos" ? 0.05 : 0,
              elevation: activeTab === "equipos" ? 1 : 0,
            }}
            onPress={() => setActiveTab("equipos")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text
                className={`font-bold ${activeTab === "equipos" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                Equipos
              </Text>
              {unreadEquipos > 0 && (
                <View style={{ backgroundColor: '#ef4444', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 6, paddingHorizontal: 4 }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{unreadEquipos > 99 ? '99+' : unreadEquipos}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-2">
        {activeTab === "amigos" ? renderAmigos() : renderEquipos()}
      </ScrollView>
    </SafeAreaView>
  );
}
