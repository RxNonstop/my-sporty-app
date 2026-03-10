import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getEquiposService,
  getEquipoByIdService,
  updateEquipoService,
  deleteEquipoService,
  enviarInvitacionService,
  createEquipoService
} from '../services/equipoService'
import { AuthContext } from './AuthContext';
export const EquipoContext = createContext();

export const EquipoProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const { usuario } = useContext(AuthContext);
  const [yourTeams, setYourTeams] = useState([]);
  const [otherTeams, setOtherTeams] = useState([]);
  const [equipo, setEquipo] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [isLoading, setIsLoading] = useState();

    useEffect(() => async () => {
        if(usuario){
            await getEquipos();
        }
        else{
            setOtherTeams([]);
            setYourTeams([]);
        }
    }, [usuario]);

    // useEffect(() => {
    //     if(equipos!=0 && usuario){
    //         equipos.map(equipo => {
    //             if (equipo.propietario_id === usuario?.id) { 
    //                 setYourTeams(prev => [...prev, equipo]);
    //             } else {
    //                 setOtherTeams(prev => [...prev, equipo]);
    //             }
    //         });
    //     }
    // }, [equipos]);

    const getEquipos = async () => {
        setIsLoading(true);
        try {
            const data = await getEquiposService();
            data.data.map(equipo => {
                if (equipo.propietario_id === usuario?.id) {
                    setYourTeams(prev => [...prev, equipo]);
                    console.log(yourTeams, " tu equipo")
                } else {
                    setOtherTeams(prev => [...prev, equipo]);
                    console.log(otherTeams, " otro equipo")
                }
            });
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

    const createEquipo = async (nombre, deporte) => {
        setIsLoading(true);
        try {
            const response = await createEquipoService(nombre, deporte);
            if (response.status === 201) {
                setYourTeams((prev) => [...prev, response.data.equipo]);
            }
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
            if (response.status === 200 ) {
                setYourTeams((prev) => prev.filter((equipo) => equipo.id !== id));
                console.log(equipos, "equipos")
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

    const enviarInvitacion = async (para_usuario_id, para_equipo_id) => {
        setIsLoading(true);
        try {
            const response = await enviarInvitacionService(para_usuario_id, para_equipo_id);
            if (response.status === 200) {
                Alert.alert('Invitación enviada', 'Se ha enviado la invitación correctamente');
                console.log("se ha enviado la invitación correctamente");
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

    return (
        <EquipoContext.Provider
        value={{
            equipo,
            yourTeams,
            otherTeams,
            usuario,
            selectedEquipo,
            isLoading,
            getEquipoById,
            getEquipos,
            createEquipo,
            updateEquipo,
            deleteEquipo,
            enviarInvitacion,
        }}
        >
        {children}
        </EquipoContext.Provider>
    );
};
