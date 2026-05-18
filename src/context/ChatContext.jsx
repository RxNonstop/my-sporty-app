import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { getResumenMensajesService, marcarAmigoLeidoService, marcarEquipoLeidoService, marcarCampeonatoLeidoService } from '../services/mensajeService';
import { SocketContext } from './SocketContext';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const { usuario } = useContext(AuthContext);

  const [resumenAmigos, setResumenAmigos] = useState({});
  const [resumenEquipos, setResumenEquipos] = useState({});
  const [resumenCampeonatos, setResumenCampeonatos] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);


  const cargarResumen = useCallback(async () => {
    try {
      if (!usuario) return;
      const data = await getResumenMensajesService();
      if (!data.error && data.data) {
        setResumenAmigos(data.data.amigos || {});
        setResumenEquipos(data.data.equipos || {});
        setResumenCampeonatos(data.data.campeonatos || {});
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
      setResumenCampeonatos({});
      setTotalUnread(0);
    }
  }, [cargarResumen, usuario]);

  // Handle incoming messages
  useEffect(() => {
    if (socket && usuario) {
      const handleAmigoMessage = (msg) => {
        // Only trigger unread if it's not sent by me (safe type comparison)
        const isFromMe = String(msg.emisor_id) === String(usuario.id);
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
        const isFromMe = String(msg.emisor_id) === String(usuario.id);

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

      const handleCampeonatoMessage = (msg) => {
        const id = msg.campeonato_id;
        const isFromMe = String(msg.emisor_id) === String(usuario.id);

        setResumenCampeonatos(prev => {
          const prevResumen = prev[id] || { unread_count: 0 };
          return {
            ...prev,
            [id]: {
              ...prevResumen,
              unread_count: isFromMe ? prevResumen.unread_count : prevResumen.unread_count + 1,
              ultimo_mensaje: msg.mensaje,
            }
          };
        });
      };

      socket.on('receive_message_amigo', handleAmigoMessage);
      socket.on('receive_message_equipo', handleEquipoMessage);
      socket.on('receive_message_campeonato', handleCampeonatoMessage);

      return () => {
        socket.off('receive_message_amigo', handleAmigoMessage);
        socket.off('receive_message_equipo', handleEquipoMessage);
        socket.off('receive_message_campeonato', handleCampeonatoMessage);
      };
    }
  }, [socket, usuario]);

  // Recalculate totalUnread 
  useEffect(() => {
    let unread = 0;
    Object.values(resumenAmigos).forEach(chat => unread += (chat.unread_count || 0));
    Object.values(resumenEquipos).forEach(chat => unread += (chat.unread_count || 0));
    Object.values(resumenCampeonatos).forEach(chat => unread += (chat.unread_count || 0));
    setTotalUnread(unread);
  }, [resumenAmigos, resumenEquipos, resumenCampeonatos]);

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

  const marcarCampeonatoLeido = useCallback(async (id) => {
    setResumenCampeonatos(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        unread_count: 0
      }
    }));
    try {
      await marcarCampeonatoLeidoService(id);
    } catch (e) { console.error(e); }
  }, []);

  const value = useMemo(() => ({
    resumenAmigos,
    resumenEquipos,
    resumenCampeonatos,
    totalUnread,
    cargarResumen,
    marcarAmigoLeido,
    marcarEquipoLeido,
    marcarCampeonatoLeido
  }), [resumenAmigos, resumenEquipos, resumenCampeonatos, totalUnread, cargarResumen, marcarAmigoLeido, marcarEquipoLeido, marcarCampeonatoLeido]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
