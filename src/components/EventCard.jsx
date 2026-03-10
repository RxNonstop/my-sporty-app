import { View, Text, TouchableOpacity } from "react-native";

export default function EventCard({ evento, onPress }) {
  const getStatusColorClass = (estado) => {
    switch (estado) {
      case "borrador":
        return "bg-[#6c757d] dark:bg-neutral-600";
      case "activo":
        return "bg-[#28a745] dark:bg-green-600";
      case "finalizado":
        return "bg-gray-400 dark:bg-neutral-500";
      default:
        return "bg-[#007bff] dark:bg-blue-600";
    }
  };

  const getPrivacyBadge = (privacidad) => {
    return privacidad === "publico" ? "Público" : "Privado";
  };

  const getEventTypeBadge = (tipo_actividad) => {
    switch (tipo_actividad) {
      case "futbol":
        return "Fútbol";
      case "baloncesto":
        return "Baloncesto";
      case "beisbol":
        return "Béisbol";
      default:
        return "Otro";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="mx-5 mb-4 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-[#eaeaea] dark:border-neutral-700 overflow-hidden mt-4"
    >
      <View className="flex-row justify-between items-center px-4 py-3 bg-[#f5f5f5] dark:bg-neutral-900 border-b border-[#eaeaea] dark:border-neutral-700">
        <Text className="text-[14px] font-semibold text-[#1a1a1a] dark:text-white capitalize">
          {getEventTypeBadge(evento.deporte)}
        </Text>
        <View className="flex-row gap-2">
          <View className="bg-white dark:bg-neutral-700 border border-[#eaeaea] dark:border-neutral-600 rounded px-2 py-1">
            <Text className="text-[11px] font-medium text-[#1a1a1a] dark:text-neutral-200">
              {getPrivacyBadge(evento.privacidad)}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-4">
        <Text className="text-[17px] font-bold text-[#1a1a1a] dark:text-white mb-2">
          {evento.nombre}
        </Text>

        {evento.descripcion && (
          <Text className="text-[13px] text-[#6a6a6a] dark:text-neutral-400 mb-4 leading-5">
            {evento.descripcion}
          </Text>
        )}

        <View className="bg-[#fafafa] dark:bg-neutral-900/50 rounded-lg p-3 mb-4 border border-[#eaeaea] dark:border-neutral-700/50">
          <View className="flex-row justify-between">
            <View className="flex-1 border-r border-[#eaeaea] dark:border-neutral-700 mr-2 pr-2">
              <Text className="text-[10px] text-[#8a8a8a] dark:text-neutral-500 font-medium text-center mb-1">
                JUGADORES
              </Text>
              <Text className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200 text-center">
                {evento.numero_jugadores}
              </Text>
            </View>
            <View className="flex-1 border-r border-[#eaeaea] dark:border-neutral-700 mx-2 px-2">
              <Text className="text-[10px] text-[#8a8a8a] dark:text-neutral-500 font-medium text-center mb-1">
                SUPLENTES
              </Text>
              <Text className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200 text-center">
                {evento.numero_suplentes}
              </Text>
            </View>
            <View className="flex-1 ml-2 pl-2">
              <Text className="text-[10px] text-[#8a8a8a] dark:text-neutral-500 font-medium text-center mb-1">
                EQUIPOS
              </Text>
              <Text className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200 text-center">
                {evento.numero_equipos}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-[12px] text-[#8a8a8a] dark:text-neutral-400 font-medium">
              INSCRIPCIONES
            </Text>
            <Text
              className={`text-[12px] font-semibold ${
                evento.inscripciones_abiertas === "1"
                  ? "text-[#28a745] dark:text-green-500"
                  : "text-[#dc3545] dark:text-red-500"
              }`}
            >
              {evento.inscripciones_abiertas === "1"
                ? " Abiertas"
                : " Cerradas"}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-3 bg-[#fafafa] dark:bg-neutral-900/80 border-t border-[#eaeaea] dark:border-neutral-700">
        <Text className="text-center text-[13px] text-[#007bff] dark:text-blue-400 font-medium">
          Ver detalles
        </Text>
      </View>
    </TouchableOpacity>
  );
}
