// src/services/authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://localhost/api-DeportProyect/api/index.php';

export const login = async (correo, password) => {
  const res = await axios.post(`${API_URL}/login`, { correo, password },{
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const { token, user} = res.data.data;

  console.log(token, user, "servicio")
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getUser = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data.data.user;
};