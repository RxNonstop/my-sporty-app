import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { AmistadContext } from '../context/AmistadContext';

const FriendCard = ({ item }) => (
  <View className="flex-row items-center p-4 bg-white dark:bg-neutral-800 rounded-2xl mb-3 border border-gray-100 dark:border-neutral-700 shadow-sm">
    <View className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/10 items-center justify-center mr-4">
      <Ionicons name="person" size={24} color="#1D4ED8" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-gray-900 dark:text-white">{item.nombre}</Text>
      <Text className="text-xs text-gray-500 dark:text-neutral-400">{item.correo}</Text>
    </View>
    <TouchableOpacity className="p-2">
      <Ionicons name="chatbubble-ellipses-outline" size={20} color="#6B7280" />
    </TouchableOpacity>
  </View>
);

const UserFoundCard = ({ item, onAdd, onCancel }) => (
  <View className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/50 mb-6 shadow-sm">
    <View className="flex-row items-center mb-4">
       <View className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center mr-4">
        <Text className="text-white text-xl font-black">{item.nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-black text-gray-900 dark:text-white">{item.nombre}</Text>
        <Text className="text-sm text-blue-600 dark:text-blue-400">{item.correo}</Text>
      </View>
    </View>
    
    <View className="flex-row gap-2">
      <TouchableOpacity 
        onPress={onAdd}
        className="flex-1 bg-blue-600 py-3.5 rounded-2xl items-center shadow-md shadow-blue-200"
      >
        <Text className="text-white font-black text-sm text-center">Enviar Solicitud</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onCancel}
        className="px-5 bg-white dark:bg-neutral-800 py-3.5 rounded-2xl border border-gray-200 dark:border-neutral-700"
      >
        <Ionicons name="close" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function FriendsScreen() {
  const { amigos, cargarAmigos, encontrarUsuarioPorCorreo, enviarSolicitudPorId, loading } = useContext(AmistadContext);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState();
  const [correoNuevo, setCorreoNuevo] = useState('');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    cargarAmigos();
  }, [cargarAmigos]);

  const agregarAmigo = async (id) => {
    await enviarSolicitudPorId(id);
    Alert.alert("Solicitud enviada", "Se ha enviado correctamente la solicitud de amistad.");
    setCorreoNuevo('');
    setUsuarioEncontrado(null);
  };

  const buscarUsuarioPorCorreo = async () => {
    if (!correoNuevo.trim()) return;
    setBuscando(true);
    try {
      const res = await encontrarUsuarioPorCorreo(correoNuevo);
      setUsuarioEncontrado(res);
      if (!res) Alert.alert("No encontrado", "No se encontró ningún usuario con ese correo.");
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <View className="flex-1 px-5">
        
        {/* Header */}
        <View className="mt-6 mb-8">
          <Text className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            Amigos
          </Text>
          <Text className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Conecta y compite con tu círculo
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mb-6">
          <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-4 py-1 border border-gray-100 dark:border-neutral-700 shadow-sm">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar por correo..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 h-12 ml-2 text-base text-gray-900 dark:text-white"
              value={correoNuevo}
              onChangeText={setCorreoNuevo}
              autoCapitalize="none"
              keyboardType="email-address"
              onSubmitEditing={buscarUsuarioPorCorreo}
            />
            {buscando ? (
              <ActivityIndicator color="#1D4ED8" size="small" />
            ) : correoNuevo.length > 0 ? (
              <TouchableOpacity onPress={buscarUsuarioPorCorreo}>
                <View className="bg-blue-600 rounded-xl px-3 py-1.5">
                  <Text className="text-white font-bold text-xs">Buscar</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Found User UI */}
        {usuarioEncontrado && (
          <UserFoundCard 
            item={usuarioEncontrado} 
            onAdd={() => agregarAmigo(usuarioEncontrado.id)}
            onCancel={() => { setUsuarioEncontrado(null); setCorreoNuevo(''); }}
          />
        )}

        {/* Friends List */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">Tu Círculo</Text>
            <View className="bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
               <Text className="text-[10px] font-black text-blue-700 dark:text-blue-300">{amigos.length}</Text>
            </View>
          </View>

          <FlatList
            data={amigos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FriendCard item={item} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-20 items-center">
                <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 items-center justify-center mb-4">
                   <Ionicons name="people-outline" size={32} color="#D1D5DB" />
                </View>
                <Text className="text-gray-400 dark:text-neutral-500 italic text-center px-10">
                  Aún no tienes amigos en tu círculo. ¡Busca a alguien por su correo!
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}