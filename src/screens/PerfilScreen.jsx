import React, { useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const StatItem = ({ icon, label, value, color }) => (
  <View className="flex-1 items-center bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-gray-100 dark:border-neutral-700 shadow-sm">
    <View className={`w-10 h-10 rounded-full items-center justify-center mb-2`} style={{ backgroundColor: color + '15' }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text className="text-lg font-extrabold text-gray-900 dark:text-white">{value}</Text>
    <Text className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase font-bold tracking-tighter">{label}</Text>
  </View>
);

const InfoRow = ({ icon, label, value }) => (
  <View className="flex-row items-center justify-between py-4 border-b border-gray-50 dark:border-neutral-800/50">
    <View className="flex-row items-center">
      <View className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#6B7280" />
      </View>
      <Text className="text-gray-500 dark:text-neutral-400 text-sm">{label}</Text>
    </View>
    <Text className="text-gray-900 dark:text-white font-semibold text-sm">{value}</Text>
  </View>
);

export default function PerfilScreen() {
  const { usuario } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }} >
      <ScrollView style={{ flex: 1 }} className="px-4" showsVerticalScrollIndicator={false}>
        {/* Header / Banner area */}
        <View className="items-center mt-8 mb-6">
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-800 shadow-xl overflow-hidden">
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                className="w-full h-full"
              />
            </View>
            <TouchableOpacity className="absolute bottom-1 right-1 bg-blue-700 p-2 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mt-4">{usuario?.nombre}</Text>
          <Text className="text-sm text-gray-500 dark:text-neutral-400">{usuario?.correo}</Text>
          
          <View className="mt-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
            <Text className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{usuario?.rol}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          <StatItem icon="trophy-outline" label="Campeonatos" value="3" color="#1D4ED8" />
          <StatItem icon="shield-outline" label="Equipos" value="2" color="#16A34A" />
          <StatItem icon="people-outline" label="Amigos" value="12" color="#7C3AED" />
        </View>

        {/* Info Section */}
        <View className="bg-white dark:bg-neutral-800 rounded-3xl p-5 border border-gray-100 dark:border-neutral-700 shadow-sm mb-6">
          <Text className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Información Personal
          </Text>
          <InfoRow 
            icon="calendar-outline" 
            label="Nacimiento" 
            value={usuario?.fecha_nacimiento || "No especificada"} 
          />
          <InfoRow 
            icon="male-female-outline" 
            label="Género" 
            value={usuario?.sexo === 'F' ? 'Femenino' : 'Masculino'} 
          />
          <InfoRow 
            icon="call-outline" 
            label="Teléfono" 
            value={usuario?.telefono || "No registrado"} 
          />
          <View className="py-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
               <View className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 items-center justify-center mr-3">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
              </View>
              <Text className="text-gray-500 dark:text-neutral-400 text-sm">Miembro desde</Text>
            </View>
            <Text className="text-gray-900 dark:text-white font-semibold text-sm">Marzo 2024</Text>
          </View>
        </View>

        <TouchableOpacity className="flex-row items-center justify-center bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-gray-200 dark:border-neutral-700 mb-10 shadow-sm">
          <Ionicons name="create-outline" size={20} color="#1D4ED8" />
          <Text className="text-blue-700 dark:text-blue-400 font-bold ml-2">Editar Perfil</Text>
        </TouchableOpacity>
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}