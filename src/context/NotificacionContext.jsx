import React, { createContext, useState, useEffect } from 'react';
import { 
  getSolicitudes,
  responderSolicitud
} from '../services/notificacionService'

export const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const cargarNotificaciones = async () => {
    setIsLoading(true);
    try {
      const data = await getSolicitudes();
      setNotificaciones(data);
    } catch (err) {
      console.error('Error al cargar amigos:', err);
    }finally{
      setIsLoading(false);
    }
  };

  const responderNotificacion = async (id, estado) =>{
    setIsLoading(true);
    try {
      await responderSolicitud(id, estado);
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
    cargarNotificaciones();
  }, []);

  return (
    <NotificacionContext.Provider
      value={{
        notificaciones,
        cargarNotificaciones,
        responderNotificacion
      }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};
