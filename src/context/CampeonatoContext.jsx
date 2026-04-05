import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import {
  getMisEventos,
  getEventoById,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  getEventosPublicos,
} from "../services/eventoService";
import { AuthContext } from "./AuthContext";

export const CampeonatoContext = createContext();

export const CampeonatoProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [campeonatosPublicos, setCampeonatosPublicos] = useState([]);
  const [misCampeonatos, setMisCampeonatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campeonato, setCampeonato] = useState(null);

  const getCampeonatosPublicos = useCallback(async () => {
    const data = await getEventosPublicos();
    setCampeonatosPublicos(data);
    return data;
  }, []);

  const getMisCampeonatos = useCallback(async (userId) => {
    const data = await getMisEventos(userId);
    setMisCampeonatos(data);
  }, []);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      if (usuario) {
        await getMisCampeonatos(usuario.id);
        await getCampeonatosPublicos();
      } else {
        setMisCampeonatos([]);
      }
    };
    fetchCampeonatos();
  }, [usuario, getMisCampeonatos, getCampeonatosPublicos]);

  const getCampeonatoByID = useCallback(async (id) => {
    const data = await getEventoById(id);
    setCampeonato(data);
  }, []);

  const refreshCampeonatosPublicos = useCallback(async () => {
    if (usuario) {
      setLoading(true);
      await getCampeonatosPublicos();
      setTimeout(() => setLoading(false), 500);
    } else {
      setCampeonatosPublicos([]);
    }
  }, [usuario, getCampeonatosPublicos]);

  const agregarCampeonato = useCallback(async (nuevoCampeonato) => {
    const data = await crearEvento(nuevoCampeonato);
    setMisCampeonatos((prev) => [...prev, data]);
  }, []);

  const modificarCampeonato = useCallback(async (id, cambios) => {
    const data = await actualizarEvento(id, cambios);
    setMisCampeonatos((prev) =>
      prev.map((campeonato) => (campeonato.id === id ? data : campeonato)),
    );
  }, []);

  const eliminarCampeonato = useCallback(async (id) => {
    await eliminarEvento(id);
    setMisCampeonatos((prev) =>
      prev.filter((campeonato) => campeonato.id !== id),
    );
  }, []);

  const value = useMemo(() => ({
    misCampeonatos,
    campeonatosPublicos,
    campeonato,
    loading,
    getMisCampeonatos,
    getCampeonatoByID,
    agregarCampeonato,
    modificarCampeonato,
    eliminarCampeonato,
    refreshCampeonatosPublicos
  }), [misCampeonatos, campeonatosPublicos, campeonato, loading, getMisCampeonatos, getCampeonatoByID, agregarCampeonato, modificarCampeonato, eliminarCampeonato, refreshCampeonatosPublicos]);

  return (
    <CampeonatoContext.Provider value={value}>
      {children}
    </CampeonatoContext.Provider>
  );
};
