import React, { createContext, useState, useEffect, useContext } from "react";
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
  const [campeonato, setCampeonato] = useState();
  console.log(campeonatosPublicos);
  useEffect(() => {
    const fetchCampeonatos = async () => {
      console.log("Usuario en CampeonatoContext:", usuario);
      if (usuario) {
        console.log("Obteniendo campeonatos para el usuario:", usuario.id);
        await getMisCampeonatos(usuario.id);
        await getCampeonatosPublicos();
      } else {
        setMisCampeonatos([]);
      }
    };

    fetchCampeonatos();
  }, [usuario]);

  const getCampeonatosPublicos = async () => {
    const data = await getEventosPublicos();
    setCampeonatosPublicos(data);
    return data;
  };

  const getMisCampeonatos = async (userId) => {
    const data = await getMisEventos(userId);

    setMisCampeonatos(data);
  };

  const getCampeonatoByID = async (id) => {
    const data = await getEventoById(id);
    setCampeonato(data);
  };

  const agregarCampeonato = async (nuevoCampeonato) => {
    const data = await crearEvento(nuevoCampeonato);
    setMisCampeonatos((prev) => [...prev, data]);
  };

  const modificarCampeonato = async (id, cambios) => {
    const data = await actualizarEvento(id, cambios);
    setMisCampeonatos((prev) =>
      prev.map((campeonato) => (campeonato.id === id ? data : campeonato)),
    );
  };

  const eliminarCampeonato = async (id) => {
    await eliminarEvento(id);
    setMisCampeonatos((prev) =>
      prev.filter((campeonato) => campeonato.id !== id),
    );
  };

  return (
    <CampeonatoContext.Provider
      value={{
        misCampeonatos,
        getMisCampeonatos,
        getCampeonatoByID,
        agregarCampeonato,
        modificarCampeonato,
        eliminarCampeonato,
        campeonatosPublicos,
        getCampeonatosPublicos,
        setCampeonatosPublicos,
      }}
    >
      {children}
    </CampeonatoContext.Provider>
  );
};
