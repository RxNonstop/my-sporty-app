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
  const res = await axios.get(`${API_URL}/solicitudes-amistad`, await authHeader());
  return res.data.data.solicitudes;
};

export const responderSolicitud = async (id, estado) => {
  const res = await axios.put(`${API_URL}/solicitudes-amistad/${id}`, { estado }, await authHeader());
  return res.data;
};

export const eliminarSolicitudPorId = async (id) => {
  const res = await axios.delete(`${API_URL}/amistades/${id}`, await authHeader());
  return res.data;
};