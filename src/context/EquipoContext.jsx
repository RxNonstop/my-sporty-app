import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  getEquiposService,
  getEquipoByIdService,
  deleteEquipoService,
  enviarInvitacionService,
  createEquipoService
} from '../services/equipoService';
import { AuthContext } from './AuthContext';

export const EquipoContext = createContext();

export const EquipoProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [yourTeams, setYourTeams] = useState([]);
  const [otherTeams, setOtherTeams] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getEquipos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEquiposService();
      const teams = data.data;
      const your = teams.filter(e => e.propietario_id === usuario?.id);
      const others = teams.filter(e => e.propietario_id !== usuario?.id);
      setYourTeams(your);
      setOtherTeams(others);
    } catch (err) {
      console.error('Error al cargar equipos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      getEquipos();
    } else {
      setOtherTeams([]);
      setYourTeams([]);
    }
  }, [usuario, getEquipos]);

  const getEquipoById = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const data = await getEquipoByIdService(id);
      if (data.status === 200) {
        setEquipo(data);
      }
    } catch (err) {
      console.error('Error al cargar equipo:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEquipo = useCallback(async (nombre, deporte) => {
    setIsLoading(true);
    try {
      const response = await createEquipoService(nombre, deporte);
      if (response.status === 201) {
        setYourTeams((prev) => [...prev, response.data.equipo]);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEquipo = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteEquipoService(id);
      if (response.status === 200) {
        setYourTeams((prev) => prev.filter((equipo) => equipo.id !== id));
        if (selectedEquipo?.id === id) setSelectedEquipo(null);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedEquipo]);

  const enviarInvitacion = useCallback(async (para_usuario_id, para_equipo_id) => {
    setIsLoading(true);
    try {
      const response = await enviarInvitacionService(para_usuario_id, para_equipo_id);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    equipo,
    yourTeams,
    otherTeams,
    usuario,
    selectedEquipo,
    isLoading,
    getEquipoById,
    getEquipos,
    createEquipo,
    deleteEquipo,
    enviarInvitacion
  }), [equipo, yourTeams, otherTeams, usuario, selectedEquipo, isLoading, getEquipoById, getEquipos, createEquipo, deleteEquipo, enviarInvitacion]);

  return (
    <EquipoContext.Provider value={value}>
      {children}
    </EquipoContext.Provider>
  );
};
