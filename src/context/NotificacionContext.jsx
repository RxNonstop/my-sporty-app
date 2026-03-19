import React, { createContext, useState, useEffect } from 'react';
import { 
  getSolicitudesService,
  getInvitacionesService,
  responderSolicitudService,
  responderInvitacionService,
  getInvitacionesCampeonatosService,
  responderInvitacionCampeonatoService
} from '../services/notificacionService'

export const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);
  const [invitacionesCampeonato, setInvitacionesCampeonato] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const cargarSolicitudes = async () => {
    setIsLoading(true);
    try {
      const data = await getSolicitudesService();
      setSolicitudes(data);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }finally{
      setIsLoading(false);
    }
  };

  const cargarInvitaciones = async () => {
    setIsLoading(true);
    try {
      const data = await getInvitacionesService();
      setInvitaciones(data);
    } catch (err) {
      console.error('Error al cargar invitaciones:', err);
    }finally{
      setIsLoading(false);
    }
  };

  const refreshNotificaciones = async () => {
    setIsLoading(true)
    await cargarSolicitudes();
    await cargarInvitaciones();
    await cargarInvitacionesCampeonatos();
    setIsLoading(false)
  }

  const cargarInvitacionesCampeonatos = async () => {
    setIsLoading(true);
    try {
      const data = await getInvitacionesCampeonatosService();
      setInvitacionesCampeonato(data);
    } catch (err) {
      console.error('Error al cargar invitaciones a campeonatos:', err);
    }finally{
      setIsLoading(false);
    }
  };

  const responderSolicitud = async (id, estado) =>{
    setIsLoading(true);
    try {
      await responderSolicitudService(id, estado);
      // if (data.status === 200) {
      //   setNotificaciones((prev) =>
      //     prev.map((c) => (c.id === id ? data.data : c))
      //   );
      // }
    } catch (err) {
      console.error('Error al responder la notificacion:', err);
    }finally{
      setIsLoading(false);
    }
  }

  const responderInvitacion = async (id, estado) =>{
    setIsLoading(true);
    try {
      await responderInvitacionService(id, estado);
    } catch (err) {
      console.error('Error al responder la notificacion:', err);
    }finally{
      setIsLoading(false);
    }
  }

  const responderInvitacionCampeonato = async (id, estado) =>{
    setIsLoading(true);
    try {
      await responderInvitacionCampeonatoService(id, estado);
    } catch (err) {
      console.error('Error al responder la invitacion a campeonato:', err);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    cargarSolicitudes();
    cargarInvitaciones();
    cargarInvitacionesCampeonatos();
  }, []);

  return (
    <NotificacionContext.Provider
      value={{
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
        isLoading
      }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};
