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

export const getSolicitudesService = async () => {
  const res = await axios.get(`${API_URL}/solicitudes-amistad`, await authHeader());
  return res.data.data.solicitudes;
};

export const getInvitacionesService = async () => {
  const res = await axios.get(`${API_URL}/invitaciones-equipo`, await authHeader());
  return res.data.data.invitaciones;
};

export const responderSolicitudService = async (id, estado) => {
  const res = await axios.put(`${API_URL}/solicitudes-amistad/${id}`, { estado }, await authHeader());
  return res.data;
};

export const responderInvitacionService = async (id, estado) => {
  const res = await axios.put(`${API_URL}/invitaciones-equipo/${id}`, { estado }, await authHeader());
  return res.data;
};

export const eliminarSolicitudPorIdService = async (id) => {
  const res = await axios.delete(`${API_URL}/amistades/${id}`, await authHeader());
  return res.data;
};