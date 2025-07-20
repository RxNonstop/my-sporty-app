import React, { createContext, useState, useEffect } from 'react';
import {
  getEquiposService,
  getEquipoByIdService,
  updateEquipoService,
  deleteEquipoService
} from '../services/equipoService'
export const EquipoContext = createContext();

export const EquipoProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [equipo, setEquipo] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [isLoading, setIsLoading] = useState();

    const getEquipos = async () => {
        setIsLoading(true);
        try {
            const data = await getEquiposService();
            setEquipos(data.data.equipos);
        } catch (err) {
            console.error('Error al cargar amigos:', err);
        }
            finally{
        setIsLoading(false);
        }
    };

    const getEquipoById = async(id) =>{
        setIsLoading(true);
        try {
            const data = await getEquipoByIdService(id);
            if(data.status == 200){
                setEquipo(data)
            }
        } catch (err) {
            console.error('Error al cargar usuario:', err);
        }
        finally{
            setIsLoading(false);
        }
    }

    const createEquipo = async (equipoData) => {
        setIsLoading(true);
        try {
            const response = await createUserService(equipoData);
            if (response.status === 201) {
                setEquipos((prev) => [...prev, response.data]);
            }
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

  const updateEquipo = async(id,data) =>{
    setIsLoading(true);
    try {
      const response = await enviarSolicitud(id);
      if(response.status == 200){
        setEquipos((prev) =>
            prev.map((u) => (u.id === id ? response.data : u))
        );
        setEquipo(response.data)
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
    }
    finally{
      setIsLoading(false);
    }
  }

  const deleteEquipo = async (id) => {
    setIsLoading(true);
    try {
        const response = await deleteEquipoService(id);
        if (response.status === 200 || response.status === 204) {
            setEquipos((prev) => prev.filter((user) => user.id !== id));
            if (selectedEquipo?.id === id) setSelectedEquipo(null);
        }
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        setIsLoading(false);
    }
    };

    const selectEquipo = (equipoId) => {
        const found = equipos.find((u) => u.id === equipoId) || null;
        setSelectedEquipo(found);
    };

    useEffect(() => {
        getEquipos();
    }, []);

    return (
        <EquipoContext.Provider
        value={{
            equipo,
            equipos,
            selectedEquipo,
            isLoading,
            getEquipoById,
            getEquipos,
            createEquipo,
            updateEquipo,
            deleteEquipo
        }}
        >
        {children}
        </EquipoContext.Provider>
    );
};
