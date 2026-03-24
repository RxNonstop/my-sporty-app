import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { getResumenMensajesService, marcarAmigoLeidoService, marcarEquipoLeidoService } from '../services/mensajeService';
import { SocketContext } from './SocketContext';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const { usuario } = useContext(AuthContext);

  const [resumenAmigos, setResumenAmigos] = useState({});
  const [resumenEquipos, setResumenEquipos] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);

  const cargarResumen = useCallback(async () => {
    try {
      if (!usuario) return;
      const data = await getResumenMensajesService();
      if (!data.error && data.data) {
        setResumenAmigos(data.data.amigos || {});
        setResumenEquipos(data.data.equipos || {});
      }
    } catch (error) {
      console.error('Error al cargar resumen de chats:', error);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      cargarResumen();
    } else {
      setResumenAmigos({});
      setResumenEquipos({});
      setTotalUnread(0);
    }
  }, [cargarResumen, usuario]);

  // Handle incoming messages
  useEffect(() => {
    if (socket && usuario) {
      const handleAmigoMessage = (msg) => {
        // Only trigger unread if it's not sent by me
        const isFromMe = msg.emisor_id === usuario.id;
        const otherId = isFromMe ? msg.receptor_id : msg.emisor_id;
        
        setResumenAmigos(prev => {
          const prevResumen = prev[otherId] || { unread_count: 0 };
          return {
            ...prev,
            [otherId]: {
              ...prevResumen,
              unread_count: isFromMe ? prevResumen.unread_count : prevResumen.unread_count + 1,
              ultimo_mensaje: msg.mensaje,
            }
          };
        });
      };

      const handleEquipoMessage = (msg) => {
        const equipoId = msg.equipo_id;
        const isFromMe = msg.emisor_id === usuario.id;

        setResumenEquipos(prev => {
          const prevResumen = prev[equipoId] || { unread_count: 0 };
          return {
            ...prev,
            [equipoId]: {
              ...prevResumen,
              unread_count: isFromMe ? prevResumen.unread_count : prevResumen.unread_count + 1,
              ultimo_mensaje: msg.mensaje,
            }
          };
        });
      };

      socket.on('receive_message_amigo', handleAmigoMessage);
      socket.on('receive_message_equipo', handleEquipoMessage);

      return () => {
        socket.off('receive_message_amigo', handleAmigoMessage);
        socket.off('receive_message_equipo', handleEquipoMessage);
      };
    }
  }, [socket, usuario]);

  // Recalculate totalUnread 
  useEffect(() => {
    let unread = 0;
    Object.values(resumenAmigos).forEach(chat => unread += (chat.unread_count || 0));
    Object.values(resumenEquipos).forEach(chat => unread += (chat.unread_count || 0));
    setTotalUnread(unread);
  }, [resumenAmigos, resumenEquipos]);

  const marcarAmigoLeido = useCallback(async (amigoId) => {
    setResumenAmigos(prev => ({
      ...prev,
      [amigoId]: {
        ...(prev[amigoId] || {}),
        unread_count: 0
      }
    }));
    try {
      await marcarAmigoLeidoService(amigoId);
    } catch (e) { console.error(e); }
  }, []);

  const marcarEquipoLeido = useCallback(async (equipoId) => {
    setResumenEquipos(prev => ({
      ...prev,
      [equipoId]: {
        ...(prev[equipoId] || {}),
        unread_count: 0
      }
    }));
    try {
      await marcarEquipoLeidoService(equipoId);
    } catch (e) { console.error(e); }
  }, []);

  const value = useMemo(() => ({
    resumenAmigos,
    resumenEquipos,
    totalUnread,
    cargarResumen,
    marcarAmigoLeido,
    marcarEquipoLeido
  }), [resumenAmigos, resumenEquipos, totalUnread, cargarResumen, marcarAmigoLeido, marcarEquipoLeido]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
