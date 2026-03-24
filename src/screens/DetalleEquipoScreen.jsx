import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, Platform, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import EstadisticasEquipoTab from "../components/EstadisticasEquipoTab";
import MiembrosEquipoTab from "../components/MiembrosEquipoTab";

const TABS = ["info", "miembros", "stats"];

export default function DetalleEquipoScreen({ route, navigation }) {
  const { equipo, isOwner } = route.params || {};
  const [activeTab, setActiveTab] = useState("info");

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <View style={{ backgroundColor: "white", borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ color: "#9ca3af", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                Información General
              </Text>
              <Text style={{ color: "#374151", fontSize: 15, lineHeight: 22, marginBottom: 16 }}>
                {equipo?.descripcion || "Sin descripción disponible."}
              </Text>

              {equipo?.deporte && (
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#eef2ff", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Ionicons name="trophy-outline" size={16} color="#4f46e5" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600" }}>Deporte</Text>
                    <Text style={{ fontSize: 14, color: "#111827", fontWeight: "700", textTransform: "capitalize" }}>{equipo.deporte}</Text>
                  </View>
                </View>
              )}

              {(equipo?.ciudad || equipo?.pais) && (
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#eef2ff", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Ionicons name="location-outline" size={16} color="#4f46e5" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600" }}>Ubicación</Text>
                    <Text style={{ fontSize: 14, color: "#111827", fontWeight: "700" }}>
                      {[equipo?.ciudad, equipo?.pais].filter(Boolean).join(", ")}
                    </Text>
                  </View>
                </View>
              )}

              {equipo?.estadio_local && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#eef2ff", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Ionicons name="business-outline" size={16} color="#4f46e5" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600" }}>Estadio Local</Text>
                    <Text style={{ fontSize: 14, color: "#111827", fontWeight: "700" }}>{equipo.estadio_local}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        );

      case "miembros":
        return (
          <MiembrosEquipoTab
            equipo={equipo}
            equipoId={equipo?.id}
            isOwner={isOwner}
          />
        );

      case "stats":
        return (
          <EstadisticasEquipoTab
            equipoId={equipo?.id}
            deporte={equipo?.deporte}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginRight: 12, padding: 8, borderRadius: 999,
            backgroundColor: "#ffffff",
            shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#111827", flex: 1 }} numberOfLines={1}>
          {equipo?.nombre}
        </Text>
        {isOwner && (
          <View style={{ backgroundColor: "#eef2ff", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: "#4f46e5", fontSize: 11, fontWeight: "700" }}>Mi equipo</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 8 }}>
        <View style={{ flexDirection: "row", backgroundColor: "#e5e7eb", borderRadius: 14, padding: 4 }}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center",
                backgroundColor: activeTab === tab ? "#ffffff" : "transparent",
                shadowColor: activeTab === tab ? "#000" : "transparent",
                shadowOpacity: 0.06, shadowRadius: 4, elevation: activeTab === tab ? 2 : 0,
              }}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={{
                fontWeight: "700", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5,
                color: activeTab === tab ? "#4f46e5" : "#6b7280",
              }}>
                {tab === "info" ? "Info" : tab === "miembros" ? "Miembros" : "Estadísticas"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
