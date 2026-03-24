import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/apiConfig';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    let newSocket;

    const inicializarSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (usuario && token) {
          // Socket.io conecta a la raíz del servidor, no a /api
          const socketUrl = API_BASE_URL.replace('/api', '');

          newSocket = io(socketUrl, {
            query: { token },
            auth: { token },
            transports: ['websocket'], // Forzar websocket para mejor rendimiento nativo
          });

          newSocket.on('connect', () => {
            console.log('[Socket] Conectado exitosamente con ID:', newSocket.id);
            setConectado(true);
            // Se inscribe en los canales de sus equipos al iniciar
            newSocket.emit('join_teams');
          });

          newSocket.on('disconnect', () => {
            console.log('[Socket] Desconectado');
            setConectado(false);
          });

          setSocket(newSocket);
        }
      } catch (err) {
        console.error('[Socket] Error inicializando:', err);
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
    <SocketContext.Provider value={{ socket, conectado }}>
      {children}
    </SocketContext.Provider>
  );
};
