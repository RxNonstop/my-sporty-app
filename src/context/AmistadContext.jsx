import React, { createContext, useState, useEffect } from 'react';
import {
  getSolicitudes,
  enviarSolicitud,
  responderSolicitud,
  eliminarSolicitud,
  getAmigos
} from '../services/amistadService';

export const AmistadContext = createContext();

export const AmistadProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [amigos, setAmigos] = useState([]);

  const cargarSolicitudes = async () => {
    try {
      const data = await getSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  };

  const cargarAmigos = async () => {
    try {
      const data = await getAmigos();
      setAmigos(data);
    } catch (err) {
      console.error('Error al cargar amigos:', err);
    }
  };

  const enviar = async (paraId) => {
    await enviarSolicitud(paraId);
    await cargarSolicitudes();
  };

  const responder = async (id, estado) => {
    await responderSolicitud(id, estado);
    await cargarSolicitudes();
    await cargarAmigos();
  };

  const eliminar = async (id) => {
    await eliminarSolicitud(id);
    await cargarSolicitudes();
  };

  useEffect(() => {
    cargarSolicitudes();
    cargarAmigos();
  }, []);

  return (
    <AmistadContext.Provider
      value={{
        solicitudes,
        amigos,
        enviar,
        responder,
        eliminar,
        cargarSolicitudes,
        cargarAmigos,
      }}
    >
      {children}
    </AmistadContext.Provider>
  );
};
