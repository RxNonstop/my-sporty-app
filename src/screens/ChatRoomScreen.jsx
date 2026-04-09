import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  getHistorialAmigoService,
  getHistorialEquipoService,
} from "../services/mensajeService";

export default function ChatRoomScreen({ route, navigation }) {
  const { type, target } = route.params; // type: 'amigo' | 'equipo', target: Object
  const { isDarkMode } = useContext(ThemeContext);
  const { socket, conectado } = useContext(SocketContext);
  const { usuario } = useContext(AuthContext);

  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const flatListRef = useRef(null);
  
  const { marcarAmigoLeido, marcarEquipoLeido } = useContext(ChatContext);
  const { setActiveChat } = useContext(SocketContext);

  useEffect(() => {
    // Establecer este chat como activo para suprimir notificaciones locales redundantes
    setActiveChat({ type, id: target.id });
    return () => setActiveChat(null);
  }, [type, target.id, setActiveChat]);

  useEffect(() => {
    if (type === "amigo") {
      marcarAmigoLeido(target.id);
    } else if (type === "equipo") {
      marcarEquipoLeido(target.id);
    }
  }, [type, target.id, marcarAmigoLeido, marcarEquipoLeido]);
  
  useEffect(() => {
    // Si llegan nuevos mensajes estando en pantalla, los marcamos como leídos instantáneamente
    if (mensajes.length > 0) {
      if (type === "amigo") {
        marcarAmigoLeido(target.id);
      } else if (type === "equipo") {
        marcarEquipoLeido(target.id);
      }
    }
  }, [mensajes.length, type, target.id, marcarAmigoLeido, marcarEquipoLeido]);

  useEffect(() => {
    cargarHistorial();

    if (socket) {
      const receiveEvent =
        type === "amigo" ? "receive_message_amigo" : "receive_message_equipo";

      const handleNewMessage = (msg) => {
        // Filtrar si el mensaje es de este chat específico
        if (type === "amigo") {
          if (
            (msg.emisor_id === target.id && msg.receptor_id === usuario.id) ||
            (msg.emisor_id === usuario.id && msg.receptor_id === target.id)
          ) {
            setMensajes((prev) => [msg, ...prev]);
          }
        } else if (type === "equipo") {
          if (Number(msg.equipo_id) === Number(target.id)) {
            setMensajes((prev) => [msg, ...prev]);
          }
        }
      };

      socket.on(receiveEvent, handleNewMessage);

      return () => {
        socket.off(receiveEvent, handleNewMessage);
      };
    }
  }, [socket, type, target.id]);

  const cargarHistorial = async (pageNumber = 1) => {
    try {
      if (pageNumber > 1) setIsLoadingMore(true);

      let res;
      if (type === "amigo") {
        res = await getHistorialAmigoService(target.id, pageNumber);
      } else {
        res = await getHistorialEquipoService(target.id, pageNumber);
      }

      if (!res.error && res.data) {
        if (pageNumber === 1) {
          setMensajes(res.data);
        } else {
          setMensajes((prev) => [...prev, ...res.data]);
        }
        
        if (res.data.length < 30) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      cargarHistorial(nextPage);
    }
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim() || !socket) return;

    if (type === "amigo") {
      socket.emit("send_message_amigo", {
        receptor_id: target.id,
        mensaje: nuevoMensaje.trim(),
      });
    } else {
      socket.emit("send_message_equipo", {
        equipo_id: target.id,
        mensaje: nuevoMensaje.trim(),
      });
    }

    setNuevoMensaje("");
  };

  const renderMensaje = ({ item }) => {
    // Verificar si es mío
    const isMine = item.emisor_id === usuario.id;

    return (
      <View
        style={{
          alignSelf: isMine ? "flex-end" : "flex-start",
          maxWidth: "80%",
          padding: 12,
          borderRadius: 16,
          marginBottom: 8,
          backgroundColor: isMine
            ? "#4f46e5"
            : isDarkMode
              ? "#262626"
              : "#ffffff",
          borderBottomRightRadius: isMine ? 0 : 16,
          borderBottomLeftRadius: isMine ? 16 : 0,
        }}
      >
        {/* Mostrar remitente si es de grupo y no soy yo */}
        {type === "equipo" && !isMine && (
          <Text
            style={{
              fontSize: 11,
              color: isDarkMode ? "#a3a3a3" : "#6b7280",
              marginBottom: 2,
              fontWeight: "600",
            }}
          >
            {item.emisor_nombre || "Usuario"}
          </Text>
        )}
        <Text
          style={{
            fontSize: 15,
            color: isMine ? "white" : isDarkMode ? "#ffffff" : "#111827",
          }}
        >
          {item.mensaje}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore || mensajes.length < 30) return null;

    return (
      <View style={{ alignItems: "center", paddingVertical: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: isDarkMode ? "#404040" : "#ffffff",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 999,
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? (
            <Text style={{ color: isDarkMode ? "#d1d5db" : "#4b5563" }}>
              Cargando...
            </Text>
          ) : (
            <Text style={{ color: isDarkMode ? "#d1d5db" : "#4b5563", fontWeight: "600" }}>
              Cargar mensajes anteriores
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm z-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginRight: 10,
            padding: 8,
            borderRadius: 999,
            backgroundColor: isDarkMode ? "#262626" : "#ffffff",
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>

        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${type === "amigo" ? "bg-indigo-100 dark:bg-indigo-900" : "bg-emerald-100 dark:bg-emerald-900/40"}`}
        >
          {type === "amigo" ? (
            <Text className="text-indigo-600 dark:text-indigo-300 font-bold text-lg">
              {target.nombre?.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={isDarkMode ? "#34d399" : "#10b981"}
            />
          )}
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-bold text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {target.nombre}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {type === "amigo"
              ? conectado
                ? "En línea"
                : "Desconectado"
              : "Chat grupal"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 , marginBottom:50}}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 :120}
      >
        <FlatList
          ref={flatListRef}
          inverted
          data={mensajes}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderMensaje}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
          }}
        />

        {/* Input Area */}
        <View className="flex-row items-center p-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <TextInput
            style={{
              flex: 1,
              backgroundColor: isDarkMode ? "#262626" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#111827",
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 12,
              maxHeight: 104,
              marginRight: 10,
            }}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={isDarkMode ? "#a3a3a3" : "#6b7280"}
            value={nuevoMensaje}
            onChangeText={setNuevoMensaje}
            multiline
          />
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: nuevoMensaje.trim()
                ? "#4f46e5"
                : isDarkMode
                  ? "#262626"
                  : "#ffffff",
            }}
            disabled={!nuevoMensaje.trim()}
            onPress={enviarMensaje}
          >
            <Ionicons
              name="send"
              size={18}
              color="white"
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
