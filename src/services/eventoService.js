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

export const getEventos = async () => {
  const res = await axios.get(`${API_URL}/campeonatos/me`, await authHeader());
  console.log('Respuesta de getEventos:', res.data);
  return res.data.data;
};

export const crearEvento = async (eventoData) => {
  const res = await axios.post(`${API_URL}/campeonatos`, eventoData, await authHeader());
  return res.data.message;
};

export const getEventoById = async (id) => {
  const res = await axios.get(`${API_URL}/campeonatos/${id}`, await authHeader());
  return res.data.data;
}

export const actualizarEvento = async (id, eventoData) => {
  const res = await axios.put(`${API_URL}/campeonatos/${id}`, eventoData, await authHeader());
  return res.data.message;
};

export const eliminarEvento = async (id) => {
  const res = await axios.delete(`${API_URL}/campeonatos/${id}`, await authHeader());
  return res.data.message;
};