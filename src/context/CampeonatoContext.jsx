import React, { createContext, useState, useEffect } from 'react';
import {
    getEventos,
    getEventoById,
    crearEvento,
    actualizarEvento,
    eliminarEvento
} from '../services/eventoService'

export const CampeonatoContext = createContext();

export const CampeonatoProvider = ({ children }) => {
    const [campeonatos, setCampeonatos] = useState([]);
    const [campeonato, setCampeonato] = useState();


    useEffect(() => {
        getCampeonatos();
    }, []);

    const getCampeonatos = async () => {
        const data = await getEventos();
        setCampeonatos(data);
    };
    
    const getCampeonatoByID = async(id) =>{
        const data = await getEventoById(id);
        setCampeonato(data);
    }

    const agregarCampeonato = async (nuevoCampeonato) => {
        const data = await crearEvento(nuevoCampeonato);
        setCampeonatos((prev) => [...prev, data]);
    };

    const modificarCampeonato = async (id, cambios) => {
        const data = await actualizarEvento(id, cambios);
        setCampeonatos((prev) =>
            prev.map((campeonato) => (campeonato.id === id ? data : campeonato))
        );
    };

    const eliminarCampeonato = async (id) => {
        await eliminarEvento(id);
        setCampeonatos((prev) => prev.filter((campeonato) => campeonato.id !== id));
    };

    return (
        <CampeonatoContext.Provider
            value={{
                campeonatos,
                getCampeonatos,
                getCampeonatoByID,
                agregarCampeonato,
                modificarCampeonato,
                eliminarCampeonato
            }}
        >
            {children}
        </CampeonatoContext.Provider>
    );
};