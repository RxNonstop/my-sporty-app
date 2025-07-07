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
  console.log(res)
  const { token, usuario, mensaje } = res.data;

  console.log(token, usuario, mensaje, "servicio")
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(usuario));
  await AsyncStorage.setItem('mensaje', JSON.stringify(mensaje));
  return usuario;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};