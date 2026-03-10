import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config/apiConfig";

const authHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

export const getEventosPublicos = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/campeonatos/publicos`,
      await authHeader(),
    );
    console.log("Respuesta de getEventosPublicos:", res.data);
    return res.data.data || [];
  } catch (error) {
    console.error(
      "Error en getEventosPublicos:",
      error.response?.status,
      error.response?.data,
    );
    if (error.response?.status === 401) {
      console.error(
        "[401] Token inválido o expirado. Verifica que estés autenticado.",
      );
    }
    return [];
  }
};

export const getMisEventos = async (userId) => {
  try {
    const res = await axios.get(
      `${API_URL}/campeonatos/propietario/${userId}`,
      await authHeader(),
    );
    console.log("Respuesta de getMisEventos:", res.data);
    if (!res.data || !res.data.data) {
      console.error("Respuesta inesperada de getMisEventos:", res.data);
      return [];
    }
    return res.data.data;
  } catch (error) {
    console.error(
      "Error en getMisEventos:",
      error.response?.status,
      error.response?.data,
    );
    if (error.response?.status === 401) {
      console.error("[401] Token inválido. Necesitas autenticarte primero.");
    }
    return [];
  }
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
