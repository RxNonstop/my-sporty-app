import axios from "axios";
import API_URL from "../config/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getHistorialAmigoService = async (amigoId, page = 1, limit = 30) => {
  const res = await axios.get(`${API_URL}/mensajes/amigo/${amigoId}?page=${page}&limit=${limit}`, await authHeader());
  return res.data;
};

export const getHistorialEquipoService = async (equipoId, page = 1, limit = 30) => {
  const res = await axios.get(`${API_URL}/mensajes/equipo/${equipoId}?page=${page}&limit=${limit}`, await authHeader());
  return res.data;
};

export const getResumenMensajesService = async () => {
  const res = await axios.get(`${API_URL}/mensajes/resumen`, await authHeader());
  return res.data;
};

export const marcarAmigoLeidoService = async (amigoId) => {
  const res = await axios.post(`${API_URL}/mensajes/amigo/${amigoId}/leer`, {}, await authHeader());
  return res.data;
};

export const marcarEquipoLeidoService = async (equipoId) => {
  const res = await axios.post(`${API_URL}/mensajes/equipo/${equipoId}/leer`, {}, await authHeader());
  return res.data;
};
