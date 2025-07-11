import React, { createContext, useState, useEffect } from 'react';
import {
  getAmigos,
  encontrarUsuario,
  enviarSolicitud
} from '../services/amistadService';

export const AmistadContext = createContext();

export const AmistadProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const cargarAmigos = async () => {
    setIsLoading(true);
    try {
      const data = await getAmigos();
      setAmigos(data);
    } catch (err) {
      console.error('Error al cargar amigos:', err);
    }
    finally{
      setIsLoading(false);
    }
  };

  const encontrarUsuarioPorCorreo = async(correo) =>{
    setIsLoading(true);
    try {
      const data = await encontrarUsuario(correo);
      if(data.status == 200){
        return data.data
      }
    } catch (err) {
      console.error('Error al cargar usuario:', err);
    }
    finally{
      setIsLoading(false);
    }
  }

  const enviarSolicitudPorId = async(id) =>{
    setIsLoading(true);
    try {
      await enviarSolicitud(id);
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    cargarAmigos();
  }, []);

  return (
    <AmistadContext.Provider
      value={{
        amigos,
        isLoading,
        cargarAmigos,
        encontrarUsuarioPorCorreo,
        enviarSolicitudPorId
      }}
    >
      {children}
    </AmistadContext.Provider>
  );
};
