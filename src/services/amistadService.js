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

export const getSolicitudes = async () => {
  const res = await axios.get(`${API_URL}/amistades`, await authHeader());
  return res.data.data.solicitudes;
};

export const enviarSolicitud = async (para_usuario_id) => {
  const res = await axios.post(`${API_URL}/amistades`, { para_usuario_id }, await authHeader());
  return res.data;
};

export const responderSolicitud = async (id, estado) => {
  const res = await axios.put(`${API_URL}/amistades/${id}`, { estado }, await authHeader());
  return res.data;
};

export const eliminarSolicitud = async (id) => {
  const res = await axios.delete(`${API_URL}/amistades/${id}`, await authHeader());
  return res.data;
};

export const getAmigos = async () => {
  const res = await axios.get(`${API_URL}/amistades?amigos=1`, await authHeader());
  return res.data.data.amigos;
};