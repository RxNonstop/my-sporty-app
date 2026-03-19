import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getSolicitudesService,
  getInvitacionesService,
  responderSolicitudService,
  responderInvitacionService
} from '../services/notificacionService'
import { AuthContext } from './AuthContext';

export const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const { usuario } = useContext(AuthContext);
  

  useEffect(() => {
    if (usuario) {
      cargarSolicitudes();
      cargarInvitaciones();
    }
    else{
      setSolicitudes([]);
      setInvitaciones([]);
    }
  }, [usuario]);

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

  useEffect(() => {
    cargarSolicitudes();
    cargarInvitaciones();
  }, []);

  return (
    <NotificacionContext.Provider
      value={{
        solicitudes,
        invitaciones,
        isLoading,
        cargarSolicitudes,
        cargarInvitaciones,
        responderSolicitud,
        responderInvitacion,
      }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};
