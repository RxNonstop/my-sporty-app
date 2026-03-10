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

export const getAmigos = async () => {
  const res = await axios.get(`${API_URL}/amistades`, await authHeader());
  return res.data.data.amigos;
};

export const enviarSolicitud = async (para_usuario_id) => {
  const res = await axios.post(`${API_URL}/solicitudes-amistad`,{para_usuario_id}, await authHeader());
  return res.data.message;
};

export const encontrarUsuario = async(email) => {
  const res = await axios.post(`${API_URL}/usuarios/email`,{email}, await authHeader())
  return res.data;
}
export const eliminarAmigo  = async(email) => {
  const res = await axios.delete(`${API_URL}/usuarios/email`,{data:{email}}, await authHeader())
  return res.data;
}