// src/services/authService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config/apiConfig";

export const login = async (correo, password) => {
  const res = await axios.post(
    `${API_URL}/auth/login`,
    { correo, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const { token, user } = res.data.data;

  console.log(token, user, "servicio");
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const register = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { token, user } = res.data.data || {};
    if (token && user) {
      console.log("[Register] Guardando token y usuario", token, user);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return user;
    }

    return res.data;
  } catch (error) {
    console.error("[Register] Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

export const getUser = async () => {
  const token = await AsyncStorage.getItem("token");
  const res = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data.data.user;
};
