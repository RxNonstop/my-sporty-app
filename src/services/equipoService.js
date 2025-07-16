import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost/api-DeportProyect/api/index.php';

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
  const res = await axios.get(`${API_URL}/equipos`, await authHeader());
  return res.data;
};

export const getEquipoByIdService = async (id) => {
  const res = await axios.get(`${API_URL}/equipos/${id}`, await authHeader());
  return res.data;
};

export const updateEquipoService = async () => {
  const res = await axios.put(`${API_URL}/equipos`, await authHeader());
  return res.data;
};

export const deleteEquipoService = async () => {
  const res = await axios.delete(`${API_URL}/equipos`, await authHeader());
  return res.data;
};

export const enviarInvitacion = async (para_usuario_id) => {
  const res = await axios.post(`${API_URL}/equipos`,{para_usuario_id}, await authHeader());
  return res.data.message;
};

// export const encontrarUsuario = async(email) => {
//   const res = await axios.post(`${API_URL}/usuarios/email`,{email}, await authHeader())
//   return res.data;
// }