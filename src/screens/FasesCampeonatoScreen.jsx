import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { getEquiposAmigosParaCampeonatoService, enviarInvitacionCampeonatoService } from '../services/equipoService';
import { getFasesService, crearFaseService, eliminarFaseService, getEquiposInscritosService, getPosicionesFaseService, getEventoById } from '../services/eventoService';
import { ThemeContext } from '../context/ThemeContext';

const FasesCampeonatoScreen = ({ route }) => {
const { campeonato, readOnly } = route.params || {};
const { usuario } = useContext(AuthContext);
const [campeonatoActual, setCampeonatoActual] = useState(campeonato);
const isOwner = !readOnly && !!usuario && campeonato?.propietario_id == usuario?.id;
const [fases, setFases] = useState([]);
const [posicionesLiga, setPosicionesLiga] = useState({});
const [modalVisible, setModalVisible] = useState(false);
const [nuevaFase, setNuevaFase] = useState('');
const [metodoFase, setMetodoFase] = useState('');
const [tamanoGrupo, setTamanoGrupo] = useState('');
const [clasificadosPorGrupo, setClasificadosPorGrupo] = useState('');
const [errorGrupo, setErrorGrupo] = useState('');
const [equiposInscritos, setEquiposInscritos] = useState([]);

// States for Inviting Friends' Teams
const [modalAmigosVisible, setModalAmigosVisible] = useState(false);
const [equiposAmigos, setEquiposAmigos] = useState([]);
const [loadingAmigos, setLoadingAmigos] = useState(false);

const { isDarkMode } = useContext(ThemeContext);

useEffect(() => {
  cargarDatosIniciales();
}, [campeonato]);

const cargarDatosIniciales = async () => {
  if (campeonatoActual?.id) {
    try {
      // Refresh campeonato state
      try {
        const campData = await getEventoById(campeonatoActual.id);
        if (campData) {
          setCampeonatoActual(campData);
        }
      } catch (err) {
        console.error(err);
      }

      const dbFases = await getFasesService(campeonatoActual.id);
      const mappedFases = dbFases.map(f => ({
        id: f.id,
        nombre: f.nombre,
        metodo: f.tipo === 'fase_grupos' ? 'grupos' : f.tipo,
        equiposIniciales: f.numero_equipos,
        equiposRestantes: f.numero_equipos
      }));
      setFases(mappedFases);

      const dbEquipos = await getEquiposInscritosService(campeonatoActual.id);
      setEquiposInscritos(dbEquipos);

      // Fetch points for `liga` to display the leader
      const positions = {};
      for (const f of mappedFases) {
        if (f.metodo === 'liga' || f.metodo === 'grupos') {
           const posFase = await getPosicionesFaseService(f.id);
           if (posFase && posFase.length > 0) {
              positions[f.id] = posFase[0]; // the 1st place
           }
        }
      }
      setPosicionesLiga(positions);
      
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  }
};

const navigation = useNavigation();

const calcularDivisores = (num) => {
  let divisores = [];
  for (let i = 2; i <= num; i++) {
    if (num % i === 0) {
      divisores.push(i);
    }
  }
  return divisores;
};

const abrirModalAmigos = async () => {
  setModalAmigosVisible(true);
  setLoadingAmigos(true);
  try {
    const response = await getEquiposAmigosParaCampeonatoService(campeonato.id);
    setEquiposAmigos(response.data || response); // depends on if res.data is nested
  } catch (error) {
    if (error.response?.status === 404) {
      setEquiposAmigos([]);
    } else {
      console.error('Error fetching friends teams:', error);
    }
  } finally {
    setLoadingAmigos(false);
  }
};

const invitarEquipo = async (equipo) => {
  try {
    await enviarInvitacionCampeonatoService(campeonato.id, equipo.propietario_id, equipo.id);
    alert('Invitación enviada a ' + equipo.nombre);
    // Remove the team from the list so they can't be invited again immediately
    setEquiposAmigos(prev => prev.filter(e => e.id !== equipo.id));
  } catch (error) {
    console.error('Error invitar equipo:', error);
    alert('Error al enviar invitación');
  }
};

const agregarFase = () => {
  if (!nuevaFase.trim() || !metodoFase) return;

  const equiposAnteriores = fases.length === 0 
    ? campeonato.numero_equipos 
    : fases[fases.length - 1].equiposRestantes;

  let equiposRestantes = equiposAnteriores;

  if (metodoFase === "liga") {
    equiposRestantes = equiposAnteriores-(equiposAnteriores-1);
  } else if (metodoFase === "eliminatoria") {
    if (equiposAnteriores % 2 !== 0) {
      equiposRestantes = Math.ceil((equiposAnteriores - 1) / 2) + 1;
    } else {
      equiposRestantes = equiposAnteriores / 2;
    }
  } else if (metodoFase === "grupos") {
    const grupo = parseInt(tamanoGrupo, 10);
    const clasificados = parseInt(clasificadosPorGrupo, 10);

    const divisoresValidos = calcularDivisores(equiposAnteriores);
    if (!divisoresValidos.includes(grupo)) {
      setErrorGrupo("El tamaño de grupo no divide equitativamente los equipos.");
      return;
    }
    if (!grupo || !clasificados) {
      setErrorGrupo("Debes ingresar valores válidos.");
      return;
    }
    if (clasificados >= grupo) {
      setErrorGrupo("Los clasificados deben ser menores que el tamaño del grupo.");
      return;
    }

    const grupos = equiposAnteriores / grupo; // garantizado equitativo
    equiposRestantes = grupos * clasificados;
  }

  if (metodoFase === 'eliminatoria' && equiposRestantes % 2 !== 0) {
      alert("No se puede hacer eliminatoria con una cantidad impar de equipos.");
      return;
  }

  const nuevaFaseParams = {
    campeonato_id: campeonato.id,
    nombre: nuevaFase.trim(),
    tipo: metodoFase === 'grupos' ? 'fase_grupos' : metodoFase,
    numero_equipos: equiposRestantes,
    orden: fases.length + 1
  };
  
  crearFaseService(nuevaFaseParams)
    .then(() => {
      cargarDatosIniciales();
      setNuevaFase('');
      setMetodoFase('');
      setTamanoGrupo('');
      setClasificadosPorGrupo('');
      setErrorGrupo('');
      setModalVisible(false);
    })
    .catch(error => {
      console.error('Error creando fase:', error);
      alert('Hubo un error al agregar la fase.');
    });
};

if (!campeonatoActual) {
  return <Text>No se encontró el campeonato.</Text>;
}

const eliminarFase = async (idFase) => {
  if(!idFase) return;
  try {
    await eliminarFaseService(idFase);
    cargarDatosIniciales();
  } catch (error) {
    console.error('Error eliminando fase:', error);
  }
};

  const renderBadge = (text, color) => (
    <View style={{ backgroundColor: color + '15' }} className="px-2 py-1 rounded mr-2 mb-2 dark:bg-opacity-20">
      <Text style={{ color }} className="text-xs font-semibold dark:opacity-90 capitalize">{text}</Text>
    </View>
  );

  const isCampeonato = campeonato?.tipo !== 'partido';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }}>
      <View style={{ flex: 1 }} className="px-5 pt-4 bg-[#fafafa] dark:bg-neutral-900">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1 rounded-full dark:bg-neutral-800">
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} className="dark:text-white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-[#1a1a1a] dark:text-white flex-1" numberOfLines={1}>
            {campeonatoActual?.nombre || "Sin nombre"}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header content from original ListHeaderComponent */}
          <View className="bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 p-4 mb-6">
            {campeonatoActual?.descripcion ? (
              <Text className="text-sm text-[#6a6a6a] dark:text-neutral-400 mb-4 leading-5">{campeonatoActual.descripcion}</Text>
            ) : null}
            
            <View className="flex-row flex-wrap mb-4">
              {renderBadge(campeonatoActual?.estado || "borrador", campeonatoActual?.estado === 'activo' || campeonatoActual?.estado === 'publicado' ? '#28a745' : campeonatoActual?.estado === 'finalizado' ? '#8a2be2' : '#6c757d')}
              {renderBadge(campeonatoActual?.privacidad || "público", '#007bff')}
              {campeonatoActual?.inscripciones_abiertas === '1' && renderBadge('Inscripciones abiertas', '#28a745')}
            </View>

            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] mb-3">
                 <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">ID</Text>
                 <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonatoActual?.id || "-"}</Text>
              </View>
              <View className="w-[48%] mb-3">
                 <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Deporte</Text>
                 <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200 capitalize">{campeonatoActual?.deporte || "-"}</Text>
              </View>
              <View className="w-[48%] mb-3">
                 <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Jugadores</Text>
                 <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonatoActual?.numero_jugadores || "0"} / {campeonatoActual?.numero_suplentes || "0"} sup</Text>
              </View>
              <View className="w-[48%] mb-3">
                 <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Inicia</Text>
                 <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonatoActual?.fecha_inicio || "-"}</Text>
              </View>
              
              {isCampeonato && (
                <>
                  <View className="w-[48%] mb-3">
                    <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Termina</Text>
                    <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonatoActual?.fecha_fin || "-"}</Text>
                  </View>
                  <View className="w-[48%] mb-3">
                    <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Equipos</Text>
                    <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonatoActual?.numero_equipos || "0"}</Text>
                  </View>
                </>
              )}
              {campeonatoActual?.telefono_contacto ? (
                <View className="w-[48%] mb-3">
                  <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Contacto</Text>
                  <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonatoActual?.telefono_contacto}</Text>
                </View>
              ) : null}
            </View>
            
            {isCampeonato && isOwner && (
              <TouchableOpacity
                className={`py-3 rounded-lg flex-row items-center justify-center mt-2 mb-2 ${equiposInscritos.length >= (campeonato?.numero_equipos || 0) ? 'bg-gray-400 dark:bg-gray-600' : 'bg-indigo-600 dark:bg-indigo-500'}`}
                onPress={abrirModalAmigos}
                disabled={equiposInscritos.length >= (campeonato?.numero_equipos || 0)}
              >
                 <Ionicons name="people-outline" size={18} color="#fff" className="mr-2" />
                 <Text className="text-white font-semibold text-sm ml-2">
                    {equiposInscritos.length >= (campeonato?.numero_equipos || 0) ? 'Cupos Llenos' : 'Invitar Equipos de Amigos'}
                 </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-base font-semibold text-[#1a1a1a] dark:text-white mb-3 mt-4">Equipos Inscritos ({equiposInscritos.length})</Text>
          {equiposInscritos.length > 0 ? (
            <View className="mb-4">
              {equiposInscritos.map((equipo) => (
                <View key={equipo.id} className="flex-row items-center p-3 bg-white dark:bg-neutral-800 rounded-lg border border-[#eaeaea] dark:border-neutral-700 mb-2">
                   <View className="flex-1">
                      <Text className="text-[14px] font-semibold text-[#1a1a1a] dark:text-white">{equipo.equipo_nombre}</Text>
                   </View>
                   <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                </View>
              ))}
            </View>
          ) : (
            <View className="p-4 items-center bg-white dark:bg-neutral-800 rounded-lg border border-[#eaeaea] dark:border-neutral-700 border-dashed mb-4">
              <Text className="text-sm text-[#8a8a8a] dark:text-neutral-400">Ningún equipo se ha inscrito todavía.</Text>
            </View>
          )}

          <Text className="text-base font-semibold text-[#1a1a1a] dark:text-white mb-3 mt-2">Fases del campeonato</Text>
          
          {fases.length === 0 ? (
            <View className="p-6 items-center bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 border-dashed">
              <Text className="text-sm text-[#8a8a8a] dark:text-neutral-400">No hay fases agregadas aún.</Text>
            </View>
          ) : (
            fases.map((item, index) => (
              <View key={index} className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 mb-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200 mb-1">{index + 1}. {item.nombre}</Text>
                    <Text className="text-[13px] text-[#6a6a6a] dark:text-neutral-400 mt-[2px]">
                      Método: <Text className="font-medium text-[#1a1a1a] dark:text-neutral-300 capitalize">{item.metodo}</Text>
                      {item.metodo === "grupos" && ` (Grupos de ${item.tamanoGrupo})`}
                    </Text>
                    <Text className="text-[13px] text-[#6a6a6a] dark:text-neutral-400 mt-[2px]">
                      Equipos: {item.metodo === 'liga' ? `${equiposInscritos.length} → 1` : `${item.equiposIniciales} → ${item.equiposRestantes}`}
                    </Text>
                  </View>

                  {/* Buttons right */}
                  <View className="flex-row items-center space-x-2">
                    <TouchableOpacity onPress={() => navigation.navigate('FixtureFaseScreen', { fase: item, campeonato: campeonatoActual, readOnly: !isOwner })} className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg relative overflow-hidden">
                      <Ionicons name="calendar-outline" size={20} className="text-indigo-600 dark:text-indigo-400" color="#4f46e5" />
                    </TouchableOpacity>
                    {isOwner && (
                      <TouchableOpacity onPress={() => eliminarFase(item.id)} className="bg-red-50 dark:bg-red-900/40 p-2 rounded-lg">
                        <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Leader badge */}
                {posicionesLiga[item.id] && (
                  <View className="mt-4 p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30 shadow-sm">
                     <Text className="text-[11px] text-yellow-700 dark:text-yellow-500 font-bold uppercase mb-1 tracking-wider">
                        {campeonatoActual?.estado === 'finalizado' ? '🏆 Campeón' : '⭐ Líder Actual de Liga'}
                     </Text>
                     <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-semibold text-[#1a1a1a] dark:text-white truncate flex-1" numberOfLines={1}>{posicionesLiga[item.id].nombre}</Text>
                        <View className="flex-row items-center border-l pl-2 border-yellow-200 dark:border-yellow-800 ml-2">
                           <Text className="text-xs font-bold text-gray-400 dark:text-gray-400 mr-2 uppercase tracking-wide">DG: {posicionesLiga[item.id].dg > 0 ? '+'+posicionesLiga[item.id].dg : posicionesLiga[item.id].dg}</Text>
                           <Text className="text-[15px] font-black text-indigo-600 dark:text-indigo-400">{posicionesLiga[item.id].pts} PTS</Text>
                        </View>
                     </View>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/40 dark:bg-black/60 justify-center items-center">
            <View className="w-[90%] bg-white dark:bg-neutral-800 rounded-xl p-6 elevation-0 border dark:border-neutral-700">
              <Text className="text-[15px] font-semibold mt-4 mb-2 text-[#1a1a1a] dark:text-white">Agregar nueva fase:</Text>
              <TextInput
                className="border border-[#eaeaea] dark:border-neutral-600 rounded-md p-2.5 mb-3 bg-[#fafafa] dark:bg-neutral-900 text-sm text-[#1a1a1a] dark:text-white"
                value={nuevaFase}
                onChangeText={setNuevaFase}
                placeholder="Nombre de la fase"
                placeholderTextColor="#8a8a8a"
              />
              <View className="flex-row justify-around mb-4">
                <TouchableOpacity
                  className={`p-2.5 rounded-md mx-1 border ${metodoFase === 'liga' ? 'bg-[#e6f2ff] dark:bg-blue-900/30 border-[#b3d7ff] dark:border-blue-800' : 'bg-[#f5f5f5] dark:bg-neutral-700 border-[#eaeaea] dark:border-neutral-600'}`}
                  onPress={() => setMetodoFase('liga')}
                >
                  <Text className={`dark:text-white ${metodoFase === 'liga' && 'dark:text-blue-200'}`}>Liga</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`p-2.5 rounded-md mx-1 border ${metodoFase === 'eliminatoria' ? 'bg-[#e6f2ff] dark:bg-blue-900/30 border-[#b3d7ff] dark:border-blue-800' : 'bg-[#f5f5f5] dark:bg-neutral-700 border-[#eaeaea] dark:border-neutral-600'}`}
                  onPress={() => setMetodoFase('eliminatoria')}
                >
                  <Text className={`dark:text-white ${metodoFase === 'eliminatoria' && 'dark:text-blue-200'}`}>Eliminatoria</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`p-2.5 rounded-md mx-1 border ${metodoFase === 'grupos' ? 'bg-[#e6f2ff] dark:bg-blue-900/30 border-[#b3d7ff] dark:border-blue-800' : 'bg-[#f5f5f5] dark:bg-neutral-700 border-[#eaeaea] dark:border-neutral-600'}`}
                  onPress={() => setMetodoFase('grupos')}
                >
                  <Text className={`dark:text-white ${metodoFase === 'grupos' && 'dark:text-blue-200'}`}>Fase de grupos</Text>
                </TouchableOpacity>
              </View>
              <Button
                title="Agregar fase"
                onPress={agregarFase}
                disabled={
                  !nuevaFase.trim() ||
                  !metodoFase ||
                  (
                    fases.length === 0
                      ? campeonato.numero_equipos
                      : fases[fases.length - 1].equiposRestantes
                  ) === 1
                }
              />
              {metodoFase === 'grupos' && (
                <>
                  <Text className="font-semibold mb-1.5 mt-2 dark:text-neutral-200">
                    Tamaño del grupo:
                  </Text>
                  <View className="border border-[#ccc] dark:border-neutral-600 rounded-md mb-3 pb-1.5 pt-1.5 dark:bg-neutral-900">
                    <Picker
                      selectedValue={tamanoGrupo}
                      onValueChange={(value) => setTamanoGrupo(value)}
                      style={{ borderWidth:0, color: '#1a1a1a' }}
                      dropdownIconColor="#8a8a8a"
                    >
                      <Picker.Item label="Seleccione tamaño de grupo" value="" color="#1a1a1a" />
                      {calcularDivisores(
                        fases.length === 0 ? campeonato.numero_equipos : fases[fases.length - 1].equiposRestantes
                      ).map((div, idx) => (
                        <Picker.Item key={idx} label={`${div}`} value={div?.toString()} color="#1a1a1a" />
                      ))}
                    </Picker>
                  </View>

                  <TextInput
                    className="border border-[#eaeaea] dark:border-neutral-600 rounded-md p-2.5 mb-3 bg-[#fafafa] dark:bg-neutral-900 text-sm text-[#1a1a1a] dark:text-white"
                    value={clasificadosPorGrupo}
                    onChangeText={setClasificadosPorGrupo}
                    placeholder="Clasificados por grupo (ej: 2)"
                    placeholderTextColor="#8a8a8a"
                    keyboardType="numeric"
                  />
                  {errorGrupo ? <Text className="text-red-500">{errorGrupo}</Text> : null}
                </>
              )}
              <View className="mt-3">
                <Button title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for Inviting Friends */}
        <Modal
          visible={modalAmigosVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalAmigosVisible(false)}
        >
          <View className="flex-1 bg-black/40 dark:bg-black/60 justify-end">
            <View className="w-full h-2/3 bg-white dark:bg-neutral-800 rounded-t-3xl pt-5 pb-8 px-5">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-[#1a1a1a] dark:text-white">Equipos de Amigos</Text>
                <TouchableOpacity onPress={() => setModalAmigosVisible(false)} className="p-1">
                  <Ionicons name="close" size={24} color="#8a8a8a" />
                </TouchableOpacity>
              </View>
              
              {loadingAmigos ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-gray-500">Cargando equipos...</Text>
                </View>
              ) : equiposAmigos.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-gray-500">No se encontraron equipos para invitar.</Text>
                </View>
              ) : (
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                >
                  {equiposAmigos.map((item) => (
                    <View key={item.id} className="flex-row items-center justify-between bg-[#fafafa] dark:bg-neutral-900 p-3 rounded-lg border border-[#eaeaea] dark:border-neutral-700 mb-3">
                      <View className="flex-1">
                        <Text className="font-semibold text-[15px] dark:text-white">{item.nombre}</Text>
                        <Text className="text-xs text-gray-500 capitalize">{item.deporte}</Text>
                      </View>
                      <TouchableOpacity 
                        className="bg-indigo-600 px-4 py-2 rounded-lg"
                        onPress={() => invitarEquipo(item)}
                      >
                        <Text className="text-white text-xs font-semibold">Invitar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {isOwner && (
          <View className="absolute bottom-6 left-0 right-0 items-center">
            <TouchableOpacity
              className="bg-[#007bff] py-3.5 px-10 rounded-lg"
              onPress={() => setModalVisible(true)}
              disabled={
                (
                  fases.length === 0
                    ? campeonato.numero_equipos
                    : fases[fases.length - 1].equiposRestantes
                ) === 1
              }
            >
              <Text className="text-white font-semibold text-[15px]">Agregar Fase</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FasesCampeonatoScreen;
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';

// const generateLigaFixture = (teams) => {
//   // Liga: todos contra todos
//   const fixture = [];
//   for (let i = 0; i < teams.length; i++) {
//     for (let j = i + 1; j < teams.length; j++) {
//       fixture.push({
//         match: `${teams[i]} vs ${teams[j]}`,
//         round: 'Fase de Liga',
//       });
//     }
//   }
//   return fixture;
// };

// const generateEliminatoriaFixture = (teams) => {
//   // Eliminatoria: emparejamientos directos
//   const fixture = [];
//   if (teams.length % 2 !== 0) {
//     teams.push('Descanso');
//   }
//   for (let i = 0; i < teams.length; i += 2) {
//     fixture.push({
//       match: `${teams[i]} vs ${teams[i + 1]}`,
//       round: 'Eliminatoria',
//     });
//   }
//   return fixture;
// };

// const FasesCampeonatoScreen = ({ route }) => {
//   const { campeonato } = route.params || {};
//   const [teams, setTeams] = useState([]);
//   const [newTeam, setNewTeam] = useState('');
//   const [method, setMethod] = useState('');
//   const [fixture, setFixture] = useState([]);

//   const addTeam = () => {
//     if (!newTeam.trim()) return;
//     setTeams([...teams, newTeam.trim()]);
//     setNewTeam('');
//   };

//   const handleGenerateFixture = () => {
//     if (teams.length < 2) {
//       Alert.alert('Agrega al menos dos equipos');
//       return;
//     }
//     let f;
//     if (method === 'liga') f = generateLigaFixture(teams);
//     else if (method === 'eliminatoria') f = generateEliminatoriaFixture(teams);
//     else {
//       Alert.alert('Selecciona un método de fixture');
//       return;
//     }
//     setFixture(f);
//   };

//   if (!campeonato) {
//     return <Text>No se encontró el campeonato.</Text>;
//   }

//   // return (
//     {/*<View style={styles.container}>
//       <Text style={styles.title}>{campeonato?.nombre || "Sin nombre"}</Text>
//       <Text style={styles.subtitle}>Agregar equipos participantes:</Text>

//       <View style={styles.inputRow}>
//         <TextInput
//           style={styles.input}
//           value={newTeam}
//           onChangeText={setNewTeam}
//           placeholder="Nombre del equipo"
//         />
//         <Button title="Agregar" onPress={addTeam} />
//       </View>

//       <FlatList
//         data={teams}
//         keyExtractor={(item, idx) => item + idx}
//         renderItem={({ item }) => (
//           <Text style={styles.teamItem}>{item}</Text>
//         )}
//         ListEmptyComponent={<Text>No hay equipos agregados aún.</Text>}
//       />

      

//       <Text style={styles.subtitle}>Selecciona método de fixture:</Text>
//       <View
//         style={styles.buttonRow}
//       >
//         <TouchableOpacity
//           style={[
//             styles.selectButton,
//             method === 'liga' && styles.selectedButton,
//           ]}
//           onPress={() => setMethod('liga')}
//         >
//           <Text>Liga</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.selectButton,
//             method === 'eliminatoria' && styles.selectedButton,
//           ]}
//           onPress={() => setMethod('eliminatoria')}
//         >
//           <Text>Eliminatoria</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.selectButton,
//             method === 'grupos' && styles.selectedButton,
//           ]}
//           onPress={() => setMethod('grupos')}
//         >
//           <Text>Fase de grupos</Text>
//         </TouchableOpacity>
//       </View>

//       <Button
//         title="Generar Fixture"
//         onPress={handleGenerateFixture}
//         disabled={teams.length < 2 || !method}
//       />

//       {fixture.length > 0 && (
//         <>
//           <Text style={styles.subtitle}>Fixture generado:</Text>
//           <FlatList
//             data={fixture}
//             keyExtractor={(_, idx) => idx.toString()}
//             renderItem={({ item }) => (
//               <Text style={styles.fixtureItem}>
//                 {item.round}: {item.match}
//               </Text>
//             )}
//           />
//         </>
//       )}
//     </View>*/}
//     <View style={styles.container}>
//       <Text style={styles.title}>{campeonato?.nombre || "Sin nombre"}</Text>
//       <Text style={styles.subtitle}>Fases del campeonato:</Text>

//       <FlatList
//         data={fixture}
//         keyExtractor={(_, idx) => idx.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.fixtureItem}>
//             {item.round}: {item.match}
//           </Text>
//         )}
//         ListEmptyComponent={<Text>No hay fixture generado aún.</Text>}
//       />

//       <FasesList />
//     </View>

//     // Componente para manejar las fases
//     function FasesList() {
//       const [fases, setFases] = useState([]);
//       const [nuevaFase, setNuevaFase] = useState('');
//       const [metodoFase, setMetodoFase] = useState('');

//       const agregarFase = () => {
//         if (!nuevaFase.trim() || !metodoFase) return;
//         setFases([
//           ...fases,
//           { nombre: nuevaFase.trim(), metodo: metodoFase }
//         ]);
//         setNuevaFase('');
//         setMetodoFase('');
//       };

//       return (
//         <View>
//           <Text style={styles.subtitle}>Agregar nueva fase:</Text>
//           <View style={styles.inputRow}>
//             <TextInput
//               style={styles.input}
//               value={nuevaFase}
//               onChangeText={setNuevaFase}
//               placeholder="Nombre de la fase"
//             />
//           </View>
//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={[
//                 styles.selectButton,
//                 metodoFase === 'liga' && styles.selectedButton,
//               ]}
//               onPress={() => setMetodoFase('liga')}
//             >
//               <Text>Liga</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.selectButton,
//                 metodoFase === 'eliminatoria' && styles.selectedButton,
//               ]}
//               onPress={() => setMetodoFase('eliminatoria')}
//             >
//               <Text>Eliminatoria</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.selectButton,
//                 metodoFase === 'grupos' && styles.selectedButton,
//               ]}
//               onPress={() => setMetodoFase('grupos')}
//             >
//               <Text>Fase de grupos</Text>
//             </TouchableOpacity>
//           </View>
//           <Button
//             title="Agregar fase"
//             onPress={agregarFase}
//             disabled={!nuevaFase.trim() || !metodoFase}
//           />

//           <Text style={styles.subtitle}>Lista de fases:</Text>
//           <FlatList
//             data={fases}
//             keyExtractor={(_, idx) => idx.toString()}
//             renderItem={({ item, index }) => (
//               <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
//                 <Text style={{ flex: 1 }}>
//                   {index + 1}. {item.nombre} ({item.metodo})
//                 </Text>
//               </View>
//             )}
//             ListEmptyComponent={<Text>No hay fases agregadas aún.</Text>}
//           />
//         </View>
//       );
//     }
// //   );
// // };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
//   subtitle: { fontSize: 16, fontWeight: '600', marginTop: 18, marginBottom: 8 },
//   inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   input: {
//     flex: 1,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 6,
//     padding: 8,
//     marginRight: 8,
//   },
//   teamItem: { fontSize: 15, paddingVertical: 3 },
//   buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
//   selectButton: {
//     padding: 10,
//     borderRadius: 6,
//     backgroundColor: '#f0f0f0',
//   },
//   selectedButton: { backgroundColor: '#cce5ff' },
//   fixtureItem: { fontSize: 15, marginVertical: 3, color: '#444' },
// });

// export default FasesCampeonatoScreen;