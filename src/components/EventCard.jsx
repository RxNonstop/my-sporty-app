import { View, Text, TouchableOpacity } from "react-native";

export default function EventCard({ evento, onPress }) {
  const getStatusColorClass = (estado) => {
    switch (estado) {
      case "borrador":
        return "bg-gray-500 dark:bg-gray-600";
      case "activo":
        return "bg-green-500 dark:bg-green-600";
      case "finalizado":
        return "bg-gray-400 dark:bg-gray-700";
      default:
        return "bg-blue-500 dark:bg-blue-600";
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
      className="mx-4 mb-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 my-4"
    >
      <View className="flex-row justify-between items-center px-4 py-3 bg-primary dark:bg-primary border-b border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 capitalize">
          {getEventTypeBadge(evento.deporte)}
        </Text>
        <View className="flex-row gap-2">
          <View className="bg-primary dark:bg-secondary rounded-full px-3 py-1">
            <Text className="text-xs font-semibold text-black dark:text-white">
              {getPrivacyBadge(evento.privacidad)}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-3">
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {evento.nombre}
        </Text>

        {evento.descripcion && (
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-5">
            {evento.descripcion}
          </Text>
        )}

        <View className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-3">
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-semibold text-center">
                JUGADORES
              </Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center">
                {evento.numero_jugadores}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-semibold text-center">
                SUPLENTES
              </Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center">
                {evento.numero_suplentes}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-semibold text-center">
                EQUIPOS
              </Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center">
                {evento.numero_equipos}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              INSCRIPCIONES
            </Text>
            <Text
              className={`text-sm font-bold ${
                evento.inscripciones_abiertas === "1"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {evento.inscripciones_abiertas === "1"
                ? " Abiertas"
                : " Cerradas"}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Text className="text-center text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
          Ver detalles
        </Text>
      </View>
    </TouchableOpacity>
  );
}
