import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMiembrosEquipoService } from "../services/equipoService";

const ROL_ICONS = {
  jugador: "person-outline",
  capitan: "star-outline",
  entrenador: "fitness-outline",
  arbitro: "flag-outline",
};

const ROL_COLORS = {
  jugador: "#6366f1",
  capitan: "#f59e0b",
  entrenador: "#10b981",
  arbitro: "#ef4444",
};

export default function MiembrosEquipoTab({ equipo, equipoId }) {
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const propietarioId = equipo?.propietario_id;

  useEffect(() => {
    fetchMiembros();
  }, [equipoId]);

  const fetchMiembros = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMiembrosEquipoService(equipoId);
      if (res?.status === 200 && res?.data?.miembros) {
        setMiembros(res.data.miembros);
      } else {
        setMiembros([]);
      }
    } catch (err) {
      console.error("Error cargando miembros:", err);
      setError("No se pudieron cargar los miembros.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
        <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
        <Text style={{ color: "#ef4444", textAlign: "center", marginTop: 12 }}>{error}</Text>
      </View>
    );
  }

  if (miembros.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
        <Ionicons name="people-outline" size={48} color="#d1d5db" />
        <Text style={{ color: "#9ca3af", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
          Este equipo aún no tiene miembros registrados.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado conteo */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <View style={{
          backgroundColor: "#eef2ff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6,
          flexDirection: "row", alignItems: "center", gap: 6,
        }}>
          <Ionicons name="people" size={16} color="#4f46e5" />
          <Text style={{ color: "#4f46e5", fontWeight: "700", fontSize: 13 }}>
            {miembros.length} miembro{miembros.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {miembros.map((m) => {
        const esCreador = m.usuario_id === propietarioId;
        const rol = m.rol_usuario || "jugador";
        const color = ROL_COLORS[rol] || "#6366f1";
        const icon = ROL_ICONS[rol] || "person-outline";
        const iniciales = (m.usuario_nombre || "?")
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <View
            key={m.id}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 14,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {/* Avatar */}
            <View style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: color + "22",
              alignItems: "center", justifyContent: "center",
              marginRight: 14,
            }}>
              <Text style={{ color, fontWeight: "800", fontSize: 16 }}>{iniciales}</Text>
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Text style={{ fontWeight: "700", fontSize: 15, color: "#111827" }}>
                  {m.usuario_nombre || "Sin nombre"}
                </Text>
                {esCreador && (
                  <View style={{
                    backgroundColor: "#fef3c7", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2,
                    flexDirection: "row", alignItems: "center", gap: 4,
                  }}>
                    <Ionicons name="shield-checkmark" size={11} color="#d97706" />
                    <Text style={{ color: "#d97706", fontSize: 10, fontWeight: "800" }}>Creador</Text>
                  </View>
                )}
              </View>
              {m.correo && (
                <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{m.correo}</Text>
              )}
            </View>

            {/* Rol badge */}
            <View style={{
              alignItems: "center", justifyContent: "center",
              backgroundColor: color + "15", borderRadius: 12,
              paddingHorizontal: 10, paddingVertical: 6, gap: 2,
            }}>
              <Ionicons name={icon} size={16} color={color} />
              <Text style={{ color, fontSize: 9, fontWeight: "700", textTransform: "uppercase" }}>
                {rol}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
