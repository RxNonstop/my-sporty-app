import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config/apiConfig";

const authHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getEventos = async (userId) => {
  const res = await axios.get(
    `${API_URL}/campeonatos/propietario/${userId}`,
    await authHeader(),
  );
  console.log("Respuesta de getEventos:", res.data);
  return res.data.data;
};

export const crearEvento = async (eventoData) => {
  const res = await axios.post(
    `${API_URL}/campeonatos`,
    eventoData,
    await authHeader(),
  );
  return res.data.message;
};

export const getEventoById = async (id) => {
  const res = await axios.get(
    `${API_URL}/campeonatos/${id}`,
    await authHeader(),
  );
  return res.data.data;
};

export const actualizarEvento = async (id, eventoData) => {
  const res = await axios.put(
    `${API_URL}/campeonatos/${id}`,
    eventoData,
    await authHeader(),
  );
  return res.data.message;
};

export const eliminarEvento = async (id) => {
  const res = await axios.delete(
    `${API_URL}/campeonatos/${id}`,
    await authHeader(),
  );
  return res.data.message;
};
