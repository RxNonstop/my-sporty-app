import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import EventCard from '../components/EventCard';
import { getMisEventos, getCampeonatosParticipando } from '../services/eventoService';

const STATUS_OPTIONS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activo / En Curso', value: 'activo' },
  { label: 'Borrador / Programado', value: 'borrador' },
  { label: 'Finalizado', value: 'finalizado' },
];

const DATE_OPTIONS = [
  { label: 'Más recientes', value: 'desc' },
  { label: 'Más antiguos', value: 'asc' },
];

const EventosScreen = () => {
  const navigation = useNavigation();
  const { usuario } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState('propios'); // 'propios' | 'participando'
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDate, setFilterDate] = useState('desc');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [propiosData, setPropiosData] = useState([]);
  const [participandoData, setParticipandoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!usuario?.id) return;
    try {
      const [propios, participando] = await Promise.all([
        getMisEventos(usuario.id),
        getCampeonatosParticipando(usuario.id),
      ]);
      setPropiosData(Array.isArray(propios) ? propios : []);
      setParticipandoData(Array.isArray(participando) ? participando : []);
    } catch (err) {
      console.error('Error fetching campeonatos:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [usuario])
  );

  const getFilteredList = () => {
    const base = activeTab === 'propios' ? propiosData : participandoData;

    let filtered = base.filter((c) => {
      if (filterStatus === 'todos') return true;
      return c.estado === filterStatus;
    });

    filtered = [...filtered].sort((a, b) => {
      const dA = new Date(a.fecha_inicio || a.fecha_creacion || 0);
      const dB = new Date(b.fecha_inicio || b.fecha_creacion || 0);
      return filterDate === 'desc' ? dB - dA : dA - dB;
    });

    return filtered;
  };

  const filteredList = getFilteredList();

  const activeStatusLabel = STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label;
  const activeDateLabel = DATE_OPTIONS.find((o) => o.value === filterDate)?.label;
  const hasActiveFilter = filterStatus !== 'todos' || filterDate !== 'desc';

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#fafafa] dark:bg-neutral-900">

      {/* TABS — same style as FixtureFaseScreen */}
      <View className="mx-5 mt-4 mb-2">
        <View className="flex-row bg-gray-200 dark:bg-neutral-800 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-md items-center ${activeTab === 'propios' ? 'bg-white dark:bg-neutral-700 shadow-sm' : ''}`}
            onPress={() => setActiveTab('propios')}
          >
            <Text className={`font-semibold text-[14px] ${activeTab === 'propios' ? 'text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-neutral-400'}`}>
              Mis Torneos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-md items-center ${activeTab === 'participando' ? 'bg-white dark:bg-neutral-700 shadow-sm' : ''}`}
            onPress={() => setActiveTab('participando')}
          >
            <Text className={`font-semibold text-[14px] ${activeTab === 'participando' ? 'text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-neutral-400'}`}>
              Participando
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER BUTTON */}
      <View className="mx-5 mb-3 flex-row items-center justify-between">
        <Text className="text-xs text-gray-500 dark:text-neutral-400">
          {filteredList.length} campeonato{filteredList.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          className={`flex-row items-center px-3 py-2 rounded-lg border ${hasActiveFilter ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-neutral-800 border-[#eaeaea] dark:border-neutral-700'}`}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={14} color={hasActiveFilter ? '#fff' : (isDarkMode ? '#aaa' : '#555')} />
          <Text className={`ml-1.5 text-xs font-semibold ${hasActiveFilter ? 'text-white' : 'text-gray-600 dark:text-neutral-400'}`}>
            {hasActiveFilter ? `${activeStatusLabel} · ${activeDateLabel}` : 'Filtrar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4f46e5']}
                tintColor={isDarkMode ? '#ffffff' : '#4f46e5'}
              />
            }
          >
            {filteredList.length === 0 ? (
              <View className="mx-5 mt-4 p-8 items-center bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 border-dashed">
                <Ionicons name="trophy-outline" size={40} color={isDarkMode ? '#555' : '#ccc'} />
                <Text className="text-center text-[#8a8a8a] dark:text-neutral-500 font-medium mt-3 mb-1">
                  {activeTab === 'propios' ? 'No has creado ningún torneo.' : 'No estás participando en ningún torneo.'}
                </Text>
                {hasActiveFilter && (
                  <Text className="text-center text-[#a1a1a1] dark:text-neutral-600 text-xs mt-1">
                    Prueba cambiando los filtros.
                  </Text>
                )}
              </View>
            ) : (
              filteredList.map((item) => (
                <EventCard
                  key={item.id}
                  evento={item}
                  onPress={() => navigation.navigate('FasesCampeonatoScreen', {
                    campeonato: item,
                    readOnly: item.propietario_id != usuario?.id,
                  })}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* FILTER MODAL POPUP */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white dark:bg-neutral-800 rounded-t-3xl px-5 pt-5 pb-10">
              <View className="w-10 h-1 bg-gray-300 dark:bg-neutral-600 rounded-full self-center mb-5" />

              {/* Estado */}
              <Text className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
                Estado
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-5">
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    className={`px-4 py-2 rounded-full border ${filterStatus === opt.value ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-[#eaeaea] dark:border-neutral-700'}`}
                    onPress={() => setFilterStatus(opt.value)}
                  >
                    <Text className={`text-sm font-semibold ${filterStatus === opt.value ? 'text-white' : 'text-gray-600 dark:text-neutral-300'}`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Fecha */}
              <Text className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
                Ordenar por fecha
              </Text>
              <View className="flex-row gap-2 mb-6">
                {DATE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    className={`px-4 py-2 rounded-full border ${filterDate === opt.value ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-[#eaeaea] dark:border-neutral-700'}`}
                    onPress={() => setFilterDate(opt.value)}
                  >
                    <Text className={`text-sm font-semibold ${filterDate === opt.value ? 'text-white' : 'text-gray-600 dark:text-neutral-300'}`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl border border-[#eaeaea] dark:border-neutral-700 items-center"
                  onPress={() => { setFilterStatus('todos'); setFilterDate('desc'); }}
                >
                  <Text className="text-sm font-semibold text-gray-500 dark:text-neutral-400">Limpiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl bg-indigo-600 items-center"
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text className="text-sm font-bold text-white">Aplicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

export default EventosScreen;
