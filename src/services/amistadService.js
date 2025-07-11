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