import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STATUS_CONFIG = {
  activo:     { label: "Activo",      bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  publicado:  { label: "Activo",      bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  programado: { label: "Programado",  bg: "#e0e7ff", text: "#3730a3", dot: "#6366f1" },
  borrador:   { label: "Borrador",    bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
  finalizado: { label: "Finalizado",  bg: "#f5f3ff", text: "#5b21b6", dot: "#7c3aed" },
};

const SPORT_ICONS = {
  futbol:     "football-outline",
  baloncesto: "basketball-outline",
  beisbol:    "baseball-outline",
  voleibol:   "balloon-outline",
};

export default function EventCard({ evento, onPress, showJoinButton, onJoin }) {
  const estado = evento.estado || "borrador";
  const sc = STATUS_CONFIG[estado] || STATUS_CONFIG.borrador;

  const inscOpen   = evento.inscripciones_abiertas == 1;
  const totalSlots = parseInt(evento.numero_equipos, 10) || 0;
  const inscribed  = parseInt(evento.equipos_inscritos, 10) || 0;
  const slotsLeft  = Math.max(0, totalSlots - inscribed);

  const isFinalized = estado === "finalizado";
  const champion    = evento.campeon_nombre;

  const sportIcon = SPORT_ICONS[evento.deporte] || "trophy-outline";

  const formatDate = (d) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return d; }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mx-5 mb-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-[#eaeaea] dark:border-neutral-700 overflow-hidden"
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#f8f8f8] dark:bg-neutral-900 border-b border-[#eaeaea] dark:border-neutral-700">
        <View className="flex-row items-center gap-2">
          <Ionicons name={sportIcon} size={15} color="#6366f1" />
          <Text className="text-[13px] font-semibold text-[#1a1a1a] dark:text-white capitalize">
            {evento.deporte || "Deporte"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* Privacy */}
          <View className="border border-[#eaeaea] dark:border-neutral-700 rounded-full px-2.5 py-0.5 bg-white dark:bg-neutral-800">
            <Text className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 capitalize">
              {evento.privacidad === "publico" ? "Público" : "Privado"}
            </Text>
          </View>
          {/* Status badge */}
          <View style={{ backgroundColor: sc.bg }} className="rounded-full px-2.5 py-0.5 flex-row items-center">
            <View style={{ backgroundColor: sc.dot }} className="w-1.5 h-1.5 rounded-full mr-1.5" />
            <Text style={{ color: sc.text }} className="text-[11px] font-bold">
              {sc.label}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Body ────────────────────────────────────────────── */}
      <View className="px-4 pt-3 pb-2">
        <Text className="text-[18px] font-bold text-[#1a1a1a] dark:text-white mb-1" numberOfLines={1}>
          {evento.nombre}
        </Text>
        {evento.descripcion ? (
          <Text className="text-[13px] text-[#6a6a6a] dark:text-neutral-400 mb-3 leading-5" numberOfLines={2}>
            {evento.descripcion}
          </Text>
        ) : null}

        {/* ── Champion Banner (if finalizado) ─────────────── */}
        {isFinalized && champion && (
          <View className="flex-row items-center bg-yellow-50 dark:bg-yellow-900/20 rounded-xl px-3 py-2.5 mb-3 border border-yellow-200 dark:border-yellow-800/40">
            <Text className="text-xl mr-2">🏆</Text>
            <View>
              <Text className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest">Campeón</Text>
              <Text className="text-[14px] font-bold text-[#1a1a1a] dark:text-white">{champion}</Text>
            </View>
          </View>
        )}

        {/* ── Stats Row ────────────────────────────────────── */}
        <View className="flex-row bg-[#fafafa] dark:bg-neutral-900/50 rounded-xl border border-[#eaeaea] dark:border-neutral-700/50 mb-3 overflow-hidden">
          <View className="flex-1 items-center py-2.5 border-r border-[#eaeaea] dark:border-neutral-700">
            <Text className="text-[10px] text-[#8a8a8a] dark:text-neutral-500 font-medium mb-0.5">JUGADORES</Text>
            <Text className="text-[15px] font-bold text-[#1a1a1a] dark:text-white">{evento.numero_jugadores ?? "—"}</Text>
          </View>
          <View className="flex-1 items-center py-2.5 border-r border-[#eaeaea] dark:border-neutral-700">
            <Text className="text-[10px] text-[#8a8a8a] dark:text-neutral-500 font-medium mb-0.5">SUPLENTES</Text>
            <Text className="text-[15px] font-bold text-[#1a1a1a] dark:text-white">{evento.numero_suplentes ?? "—"}</Text>
          </View>
          <View className="flex-1 items-center py-2.5">
            <Text className="text-[10px] text-[#8a8a8a] dark:text-neutral-500 font-medium mb-0.5">EQUIPOS</Text>
            <Text className="text-[15px] font-bold text-[#1a1a1a] dark:text-white">
              {inscribed}/{totalSlots > 0 ? totalSlots : "—"}
            </Text>
          </View>
        </View>

        {/* ── Dates ─────────────────────────────────────────── */}
        {evento.fecha_inicio && (
          <View className="flex-row items-center mb-2 gap-1">
            <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
            <Text className="text-[12px] text-gray-400 dark:text-neutral-500">
              {formatDate(evento.fecha_inicio)}
              {evento.fecha_fin ? ` → ${formatDate(evento.fecha_fin)}` : ""}
            </Text>
          </View>
        )}

        {/* ── Inscriptions status (dynamic) ─────────────────── */}
        {!isFinalized && (
          <View className="flex-row items-center gap-1 mb-1">
            <View className={`w-2 h-2 rounded-full ${inscOpen ? "bg-green-500" : "bg-red-400"}`} />
            <Text className={`text-[12px] font-semibold ${inscOpen ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              Inscripciones {inscOpen ? "Abiertas" : "Cerradas"}
            </Text>
            {inscOpen && totalSlots > 0 && (
              <Text className="text-[12px] text-gray-400 dark:text-neutral-500 ml-1">
                ({slotsLeft} cupo{slotsLeft !== 1 ? "s" : ""} libre{slotsLeft !== 1 ? "s" : ""})
              </Text>
            )}
          </View>
        )}
      </View>

      {/* ── Footer ──────────────────────────────────────────── */}
      {showJoinButton ? (
        <TouchableOpacity
          className="mx-4 mb-4 mt-1 py-3 bg-indigo-600 rounded-xl items-center flex-row justify-center gap-2"
          onPress={onJoin}
        >
          <Ionicons name="enter-outline" size={16} color="#fff" />
          <Text className="text-white font-bold text-sm">Solicitar unirse</Text>
        </TouchableOpacity>
      ) : evento.equipo_inscrito_nombre ? (
        <View className="mx-4 mb-4 mt-1 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl items-center flex-row justify-center gap-2">
          <Ionicons name="shield-checkmark-outline" size={16} color="#059669" />
          <Text className="text-[#059669] dark:text-green-400 font-bold text-sm">Inscrito con: {evento.equipo_inscrito_nombre}</Text>
        </View>
      ) : (evento.solicitud_pendiente_id || (evento.para_usuario_id === (evento.usuario_id || 0) && evento.tipo === 'solicitud_union')) ? ( // Simplified check, mainly relying on Backend field
        <View className="mx-4 mb-4 mt-1 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl items-center flex-row justify-center gap-2">
          <Ionicons name="time-outline" size={16} color="#d97706" />
          <Text className="text-[#d97706] dark:text-amber-400 font-bold text-sm">Solicitud enviada</Text>
        </View>
      ) : (
        <View className="px-4 py-3 border-t border-[#f0f0f0] dark:border-neutral-700/50 flex-row items-center justify-center gap-1">
          <Ionicons name="eye-outline" size={14} color="#6366f1" />
          <Text className="text-center text-[13px] text-indigo-600 dark:text-indigo-400 font-semibold">
            Ver detalles
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
