import React, { useEffect, useState, useContext, use } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { NotificacionContext } from '../context/NotificacionContext';
import {AmistadContext} from '../context/AmistadContext'

export default function NotificacionesScreen() {
  const {solicitudes, invitaciones, isLoading, cargarSolicitudes, cargarInvitaciones, responderSolicitud} = useContext(NotificacionContext);
  const {cargarAmigos} = useContext(AmistadContext);

  const { usuario } = useContext(AuthContext);

  useEffect(()=>{
    cargarSolicitudes();
    cargarInvitaciones();
  },[])

  const renderItem = ({ item }) => (
    <View style={[styles.notificacion]}>
      <Text style={styles.mensaje}>{item.nombre_remitente}</Text>
      <Text style={styles.fecha}>{new Date(item.fecha_envio).toLocaleString()}</Text>
      <Text style={styles.fecha}>{item.estado}</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#1D4ED8',
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 6,
            marginRight: 10,
          }}
          onPress={async() => {
            await responderSolicitud(item.id,"aceptado");
            await cargarSolicitudes();
            await cargarAmigos();
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#EF4444',
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 6,
          }}
          onPress={async() => {
            await responderSolicitud(item.id,"rechazado");
            await cargarNotificaciones();
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Notificaciones</Text>
      <Text style={styles.subtitulo}>Solicitudes de amistad</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No tienes solicitudes pendientes.</Text>}
        />
      )}

      <Text style={styles.subtitulo}>Invitaciones de equipo</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={invitaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No tienes invitaciones pendientes.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1D4ED8', marginBottom: 16 },
  subtitulo: { fontSize: 16, fontWeight: 'bold', color: '#1D4ED8', marginBottom: 12 },
  notificacion: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 10
  },
  noLeida: {
    backgroundColor: '#DBEAFE',
  },
  mensaje: {
    fontSize: 16,
    marginBottom: 4
  },
  fecha: {
    fontSize: 12,
    color: '#6B7280'
  },
  empty: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  }
});