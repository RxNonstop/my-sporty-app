import React, { createContext, useState, useEffect, useCallback, useMemo,useContext } from 'react';
import {
  getAmigos,
  encontrarUsuario,
  enviarSolicitud
} from '../services/amistadService';
import { AuthContext } from './AuthContext';

export const AmistadContext = createContext();

export const AmistadProvider = ({ children }) => {
  const [amigos, setAmigos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { usuario } = useContext(AuthContext);

  const cargarAmigos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAmigos();
      setAmigos(data);
    } catch (err) {
      console.error('Error al cargar amigos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      cargarAmigos();
    }
  }, [usuario,cargarAmigos]);

  const encontrarUsuarioPorCorreo = useCallback(async (correo) => {
    setIsLoading(true);
    try {
      const data = await encontrarUsuario(correo);
      if (data.status === 200) {
        return data.data;
      }
    } catch (err) {
      console.error('Error al cargar usuario:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enviarSolicitudPorId = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await enviarSolicitud(id);
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    amigos,
    isLoading,
    cargarAmigos,
    encontrarUsuarioPorCorreo,
    enviarSolicitudPorId
  }), [amigos, isLoading, cargarAmigos, encontrarUsuarioPorCorreo, enviarSolicitudPorId]);

  return (
    <AmistadContext.Provider value={value}>
      {children}
    </AmistadContext.Provider>
  );
};
