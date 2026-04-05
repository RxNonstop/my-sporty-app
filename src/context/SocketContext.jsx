import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../config/apiConfig";
import { AuthContext } from "./AuthContext";
import { showLocalNotification } from "../utils/localNotifications";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // { type: 'amigo'|'equipo', id: number|string }

  useEffect(() => {
    let newSocket;

    const inicializarSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (usuario && token) {
          // Socket.io conecta a la raíz del servidor, no a /api
          const socketUrl = API_BASE_URL.replace("/api", "");

          newSocket = io(socketUrl, {
            query: { token },
            auth: { token },
            transports: ["websocket"], // Forzar websocket para mejor rendimiento nativo
          });

          newSocket.on("connect", () => {
            console.log(
              "[Socket] Conectado exitosamente con ID:",
              newSocket.id,
            );
            setConectado(true);
            // Se inscribe en los canales de sus equipos al iniciar
            newSocket.emit("join_teams");
          });

          newSocket.on("disconnect", () => {
            console.log("[Socket] Desconectado");
            setConectado(false);
          });

          // --- ESCUCHA GLOBAL PARA NOTIFICACIONES LOCALES (Simulacro de Push) ---
          newSocket.on("receive_message_amigo", (msg) => {
            // Solo notificar si no soy yo el emisor
            const isFromMe = String(msg.emisor_id) === String(usuario.id);
            const isInThisChat =
              activeChat?.type === "amigo" &&
              String(activeChat?.id) === String(msg.emisor_id);

            if (!isFromMe && !isInThisChat) {
              showLocalNotification(
                msg.emisor_nombre || "Nuevo mensaje",
                msg.mensaje,
                { type: "amigo", id: msg.emisor_id },
              );
            }
          });

          newSocket.on("receive_message_equipo", (msg) => {
            const isFromMe = String(msg.emisor_id) === String(usuario.id);
            const isInThisChat =
              activeChat?.type === "equipo" &&
              String(activeChat?.id) === String(msg.equipo_id);

            if (!isFromMe && !isInThisChat) {
              showLocalNotification(
                msg.equipo_nombre || "Mensaje de equipo",
                `${msg.emisor_nombre || "Alguien"}: ${msg.mensaje}`,
                { type: "equipo", id: msg.equipo_id },
              );
            }
          });

          setSocket(newSocket);
        }
      } catch (err) {
        console.error("[Socket] Error inicializando:", err);
      }
    };

    if (usuario) {
      inicializarSocket();
    } else {
      // Si el usuario cierra sesión, el contexto de auth cambia
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConectado(false);
      }
    }

    // Cleanup object al desmontar
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [usuario]);

  return (
    <SocketContext.Provider value={{ socket, conectado, activeChat, setActiveChat }}>
      {children}
    </SocketContext.Provider>
  );
};
