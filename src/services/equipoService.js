import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../config/apiConfig';

const authHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getEquiposService = async () => {
  const res = await axios.get(`${API_URL}/equipos/mis-equipos`, await authHeader());
  return res.data;
};

export const getEquipoByIdService = async (id) => {
  const res = await axios.get(`${API_URL}/equipos/${id}`, await authHeader());
  return res.data;
};

export const getEstadisticasEquipoService = async (id) => {
  const res = await axios.get(`${API_URL}/equipos/${id}/estadisticas`, await authHeader());
  return res.data;
};

export const getMiembrosEquipoService = async (equipoId) => {
  const res = await axios.get(`${API_URL}/miembros-equipo?equipo_id=${equipoId}`, await authHeader());
  return res.data;
};

export const updateMiembroEquipoRolService = async (usuario_id, equipo_id, rol_usuario) => {
  const res = await axios.patch(`${API_URL}/miembros-equipo`, { usuario_id, equipo_id, rol_usuario }, await authHeader());
  return res.data;
};

export const updateEquipoService = async () => {
  const res = await axios.put(`${API_URL}/equipos`, await authHeader());
  return res.data;
};

export const deleteEquipoService = async (id) => {
  const res = await axios.delete(`${API_URL}/equipos/${id}`, await authHeader());
  console.log("Equipo eliminado", res.data);
  return res.data;
};

export const enviarInvitacionService = async (para_usuario_id, equipo_id) => {
  const res = await axios.post(`${API_URL}/invitaciones-equipo`, { para_usuario_id, equipo_id }, await authHeader());
  return res.data;
};

export const createEquipoService = async (nombre,deporte) => {  
  const res = await axios.post(`${API_URL}/equipos`, {nombre, deporte}, await authHeader());
  return res.data;
};

export const getEquiposAmigosParaCampeonatoService = async (campeonatoId) => {
  const res = await axios.get(`${API_URL}/equipos/amigos/para-campeonato/${campeonatoId}`, await authHeader());
  return res.data;
};

export const enviarInvitacionCampeonatoService = async (id_campeonato, id_usuario, equipo_id) => {
  const res = await axios.post(`${API_URL}/invitaciones-campeonatos`, { id_campeonato, id_usuario, equipo_id }, await authHeader());
  return res.data;
};

// export const encontrarUsuario = async(email) => {
//   const res = await axios.post(`${API_URL}/usuarios/email`,{email}, await authHeader())
//   return res.data;
// }