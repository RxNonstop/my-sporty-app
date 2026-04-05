import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  getSolicitudesService,
  getInvitacionesService,
  responderSolicitudService,
  responderInvitacionService,
  getInvitacionesCampeonatosService,
  responderInvitacionCampeonatoService,
} from "../services/notificacionService";
import { SocketContext } from "./SocketContext";
import { showLocalNotification } from "../utils/localNotifications";
import { AuthContext } from "./AuthContext";


export const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const { usuario } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);
  const [invitacionesCampeonato, setInvitacionesCampeonato] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cargarSolicitudes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSolicitudesService();
      setSolicitudes(data);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cargarInvitaciones = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getInvitacionesService();
      setInvitaciones(data);
    } catch (err) {
      console.error("Error al cargar invitaciones:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cargarInvitacionesCampeonatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getInvitacionesCampeonatosService();
      setInvitacionesCampeonato(data);
    } catch (err) {
      console.error("Error al cargar invitaciones a campeonatos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshNotificaciones = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      cargarSolicitudes(),
      cargarInvitaciones(),
      cargarInvitacionesCampeonatos(),
    ]);
    setIsLoading(false);
  }, [cargarSolicitudes, cargarInvitaciones, cargarInvitacionesCampeonatos]);

  const responderSolicitud = useCallback(async (id, estado) => {
    setIsLoading(true);
    try {
      await responderSolicitudService(id, estado);
    } catch (err) {
      console.error("Error al responder la notificacion:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const responderInvitacion = useCallback(async (id, estado) => {
    setIsLoading(true);
    try {
      await responderInvitacionService(id, estado);
    } catch (err) {
      console.error("Error al responder la notificacion:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const responderInvitacionCampeonato = useCallback(async (id, estado) => {
    setIsLoading(true);
    try {
      await responderInvitacionCampeonatoService(id, estado);
    } catch (err) {
      console.error("Error al responder la invitacion a campeonato:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      cargarSolicitudes();
      cargarInvitaciones();
      cargarInvitacionesCampeonatos();
    }
  }, [usuario,cargarSolicitudes, cargarInvitaciones, cargarInvitacionesCampeonatos]);

  useEffect(() => {
    if (socket) {
      const handleNuevaNotif = () => {
        console.log(
          "[Notificaciones] WebSocket ping: refrescando notificaciones",
        );
        refreshNotificaciones();
        showLocalNotification(
          "Nueva notificación",
          "Tienes una nueva solicitud de amistad o invitación a equipo."
        );
      };
      socket.on("nueva_notificacion", handleNuevaNotif);
      return () => {
        socket.off("nueva_notificacion", handleNuevaNotif);
      };
    }
  }, [socket, refreshNotificaciones]);

  const value = useMemo(
    () => ({
      solicitudes,
      invitaciones,
      invitacionesCampeonato,
      cargarSolicitudes,
      cargarInvitaciones,
      cargarInvitacionesCampeonatos,
      responderSolicitud,
      responderInvitacion,
      responderInvitacionCampeonato,
      refreshNotificaciones,
      isLoading,
    }),
    [
      solicitudes,
      invitaciones,
      invitacionesCampeonato,
      cargarSolicitudes,
      cargarInvitaciones,
      cargarInvitacionesCampeonatos,
      responderSolicitud,
      responderInvitacion,
      responderInvitacionCampeonato,
      refreshNotificaciones,
      isLoading,
    ],
  );

  return (
    <NotificacionContext.Provider value={value}>
      {children}
    </NotificacionContext.Provider>
  );
};
