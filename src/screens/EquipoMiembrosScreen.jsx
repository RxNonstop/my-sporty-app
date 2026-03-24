import React, { useContext } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MiembrosEquipoTab from "../components/MiembrosEquipoTab";
import { ThemeContext } from "../context/ThemeContext";

export default function EquipoMiembrosScreen({ route, navigation }) {
  const { equipo, isOwner } = route.params || {};
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }}>
      <View style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#fafafa" }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: isDarkMode ? "#262626" : "#eaeaea" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginRight: 12, padding: 8, borderRadius: 999,
              backgroundColor: isDarkMode ? "#262626" : "#ffffff",
              shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
            }}
          >
            <Ionicons name="arrow-back" size={22} color={isDarkMode ? "#ffffff" : "#1a1a1a"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
             <Text style={{ fontSize: 18, fontWeight: "800", color: isDarkMode ? "#ffffff" : "#111827" }} numberOfLines={1}>
               {equipo?.nombre || equipo?.equipo_nombre || "Equipo"}
             </Text>
             <Text style={{ fontSize: 13, color: isDarkMode ? "#a3a3a3" : "#6b7280" }}>Miembros del equipo</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <MiembrosEquipoTab
            equipo={equipo}
            equipoId={equipo?.id}
            isOwner={isOwner || false}
            scrollEnabled={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
