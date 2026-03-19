import { useEffect, useContext, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, SectionList,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { EquipoContext } from '../context/EquipoContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const SPORT_ICONS = {
  futbol: "sports-soccer",
  baloncesto: "sports-basketball",
  beisbol: "sports-baseball",
  voleibol: "sports-volleyball",
};

const TeamCard = ({ item, isOwner, onEdit, onInvite, onDelete }) => {
  const iconName = SPORT_ICONS[item.deporte?.toLowerCase()] || "shield-outline";
  
  return (
    <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-4 border border-gray-100 dark:border-neutral-700 shadow-sm">
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-3">
          <MaterialIcons name={iconName} size={28} color="#1D4ED8" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 dark:text-white" numberOfLines={1}>
            {item.nombre}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 dark:text-neutral-400 capitalize bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 rounded-md mr-2">
              {item.deporte}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 dark:text-neutral-400 ml-1">
                {item.miembros?.length || 0} miembros
              </Text>
            </View>
          </View>
        </View>
      </View>

      {isOwner && (
        <View className="flex-row mt-2 pt-3 border-t border-gray-50 dark:border-neutral-700 gap-2">
          <TouchableOpacity 
            onPress={onEdit}
            className="flex-1 flex-row items-center justify-center bg-blue-50 dark:bg-blue-900/20 py-2.5 rounded-xl border border-blue-100 dark:border-blue-800"
          >
            <Ionicons name="create-outline" size={16} color="#1D4ED8" />
            <Text className="text-blue-700 dark:text-blue-400 font-bold ml-1.5 text-xs">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onInvite}
            className="flex-1 flex-row items-center justify-center bg-green-50 dark:bg-green-900/20 py-2.5 rounded-xl border border-green-100 dark:border-green-800"
          >
            <Ionicons name="person-add-outline" size={16} color="#16A34A" />
            <Text className="text-green-700 dark:text-green-400 font-bold ml-1.5 text-xs">Invitar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onDelete}
            className="bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-800"
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function EquiposScreen() {
  const { yourTeams, otherTeams, getEquipos, deleteEquipo, isLoading } = useContext(EquipoContext);
  const { usuario } = useContext(AuthContext);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);

  const confirmarEliminar = (id) => {
    Alert.alert(
      '¿Eliminar equipo?',
      'Esta acción no se puede deshacer y eliminará a todos los miembros.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteEquipo(id);
          },
        },
      ]
    );
  };

  const renderSectionHeader = (title, count) => (
    <View className="flex-row items-center justify-between mt-6 mb-4 px-1">
      <Text className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest ">
        {title}
      </Text>
      <View className="bg-gray-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
        <Text className="text-[10px] font-bold text-gray-600 dark:text-neutral-400">{count}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    getEquipos();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }} >
      <View style={{ flex: 1 }} className="px-4">
        {isLoading && yourTeams.length === 0 && otherTeams.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#1D4ED8" size="large" />
          </View>
        ) : (
          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {renderSectionHeader("Mis Equipos", yourTeams.length)}
            {yourTeams.length === 0 ? (
              <View className="py-8 items-center bg-white dark:bg-neutral-800 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-700 mb-4">
                <Ionicons name="shield-outline" size={40} color="#9CA3AF" />
                <Text className="text-gray-400 dark:text-neutral-500 mt-2 text-sm italic">No tienes equipos aún</Text>
              </View>
            ) : (
              yourTeams.map(item => (
                <TeamCard 
                  key={item.id} 
                  item={item} 
                  isOwner={true} 
                  onEdit={() => navigation.navigate('EditarEquipoScreen', { equipo: item })}
                  onInvite={() => navigation.navigate('InvitacionEquipoScreen', { equipoId: item.id })}
                  onDelete={() => confirmarEliminar(item.id)}
                />
              ))
            )}

            {renderSectionHeader("Inscrito en", otherTeams.length)}
            {otherTeams.length === 0 ? (
              <View className="py-8 items-center bg-white dark:bg-neutral-800 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-700 mb-4">
                <Ionicons name="people-outline" size={40} color="#9CA3AF" />
                <Text className="text-gray-400 dark:text-neutral-500 mt-2 text-sm italic">No estás en otros equipos</Text>
              </View>
            ) : (
              otherTeams.map(item => (
                <TeamCard key={item.id} item={item} isOwner={false} />
              ))
            )}
          </ScrollView>
        )}
      </View>

      <View className="absolute bottom-10 left-0 right-0 items-center">
        <TouchableOpacity
          style={{
            shadowColor: "#1D4ED8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
          className="flex-row bg-blue-700 dark:bg-blue-600 px-8 py-4 rounded-full items-center justify-center"
          onPress={() => navigation.navigate('CrearEquipo')}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text className="text-white font-bold text-lg ml-2">Crear Equipo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}