import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getPartidosFaseService,
  getPosicionesFaseService,
  actualizarPartidoService,
  getEscenariosService,
  getEquiposInscritosService,
} from "../services/eventoService";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const FixtureFaseScreen = ({ route, navigation }) => {
  const { fase, campeonato, readOnly } = route.params || {};

  const [partidos, setPartidos] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [grupos, setGrupos] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fixture"); // 'fixture' | 'posiciones'
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [scoreLocal, setScoreLocal] = useState("");
  const [scoreVisitante, setScoreVisitante] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [lugar, setLugar] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);

  const esPropietario = usuario?.id == campeonato?.propietario_id;

  useEffect(() => {
    cargarFase();
  }, [fase]);

  const cargarFase = async () => {
    if (!fase) return;
    setLoading(true);
    try {
      const dbPartidos = await getPartidosFaseService(fase.id);
      setPartidos(dbPartidos || []);

      if (fase.metodo !== "eliminatoria") {
        const dbPosiciones = await getPosicionesFaseService(fase.id);

        // Si es fase de grupos y la respuesta tiene la estructura agrupada
        let posicionesProcesadas = dbPosiciones || [];
        if (fase.metodo === 'grupos' && Array.isArray(dbPosiciones) && dbPosiciones.length > 0 && dbPosiciones[0].posiciones) {
          // Aplanar la estructura agrupada para compatibilidad con el resto del código
          posicionesProcesadas = dbPosiciones.flatMap(grupo =>
            grupo.posiciones.map(pos => ({
              ...pos,
              grupo: grupo.grupo,
              grupo_nombre: grupo.nombre
            }))
          );
        }

        setPosiciones(posicionesProcesadas);
      }

      // Obtener equipos inscritos para construir grupos si es fase de grupos
      if (fase.metodo === 'grupos' && (fase.numeroGrupos || fase.tamanoGrupo)) {
        const dbEquipos = await getEquiposInscritosService(campeonato.id);
        setEquipos(dbEquipos || []);
        const gruposConstruidos = construirGrupos(
          dbEquipos || [],
          fase.numeroGrupos ? parseInt(fase.numeroGrupos, 10) : null,
          fase.tamanoGrupo ? parseInt(fase.tamanoGrupo, 10) : null
        );
        setGrupos(gruposConstruidos);
      }
    } catch (error) {
      console.error("Error cargando fixture:", error);
    } finally {
      setLoading(false);
    }
  };

  const construirGrupos = (equiposList, numeroGrupos, tamanoGrupo) => {
    const grupos = {};
    const groupSize = numeroGrupos
      ? equiposList.length / numeroGrupos
      : tamanoGrupo || equiposList.length;

    equiposList.forEach((equipo, index) => {
      const grupoNum = Math.floor(index / groupSize) + 1;
      const grupoKey = String(grupoNum);
      if (!grupos[grupoKey]) grupos[grupoKey] = [];
      grupos[grupoKey].push(equipo);
    });
    return grupos;
  };

  const normalizeEquipoId = (equipo) => {
    if (!equipo) return null;
    return equipo.equipo_id ?? equipo.id ?? equipo.id_equipo ?? null;
  };

  const getGroupForEquipo = (equipoId) => {
    if (!equipoId) return '1';
    for (const [grupo, equiposGrupo] of Object.entries(grupos)) {
      if (equiposGrupo.some(e => {
        const id = normalizeEquipoId(e);
        return id !== null && String(id) === String(equipoId);
      })) {
        return grupo;
      }
    }
    return '1';
  };

  const getPartidoEquipoId = (partido, lado) => {
    return partido[`${lado}_equipo_id`] ?? partido[`${lado}_id`] ?? partido[`${lado}Id`] ?? null;
  };

  const getGroupForPartido = (partido) => {
    const localGroup = getGroupForEquipo(getPartidoEquipoId(partido, 'equipo_local') || getPartidoEquipoId(partido, 'local'));
    const visitanteGroup = getGroupForEquipo(getPartidoEquipoId(partido, 'equipo_visitante') || getPartidoEquipoId(partido, 'visitante'));
    return localGroup === visitanteGroup ? localGroup : localGroup || visitanteGroup || '1';
  };

  const getGroupLabel = (item) => {
    // Priorizar grupo_numero ya que es el campo que envía el backend
    if (item.grupo_numero !== undefined && item.grupo_numero !== null) {
      return String(item.grupo_numero);
    }

    const backendGroup = (
      item.grupo_nombre ||
      item.grupo ||
      item.group_name ||
      item.group ||
      item.grupo_id ||
      item.group_id
    );

    if (backendGroup) return String(backendGroup);

    if (fase.metodo === 'grupos') {
      if (item.equipo_local_id || item.local_id || item.equipo_localId) {
        return getGroupForPartido(item);
      }
      const equipoId = item.equipo_id ?? item.id ?? item.id_equipo ?? null;
      return getGroupForEquipo(equipoId);
    }

    return '1';
  };

  const orderGroups = (a, b) => {
    const parsedA = parseInt(a, 10);
    const parsedB = parseInt(b, 10);
    if (!Number.isNaN(parsedA) && !Number.isNaN(parsedB)) {
      return parsedA - parsedB;
    }
    return String(a).localeCompare(String(b));
  };

  const groupPartidosByGroupAndJornada = (items) => {
    const groups = {};
    items.forEach((partido) => {
      let grupo = String(getGroupLabel(partido) || '1');

      // Si no hay información de grupo del backend y estamos en fase de grupos,
      // asignar grupo basado en la construcción de grupos
      if (fase.metodo === 'grupos' && grupo === '1' && Object.keys(grupos).length > 0) {
        grupo = getGroupForPartido(partido);
      }

      const jornada = partido.jornada || 1;
      if (!groups[grupo]) groups[grupo] = {};
      if (!groups[grupo][jornada]) groups[grupo][jornada] = [];
      groups[grupo][jornada].push(partido);
    });
    return groups;
  };

  const groupPosicionesByGroup = (items) => {
    const groups = {};
    items.forEach((pos) => {
      const grupo = String(getGroupLabel(pos) || '1');
      if (!groups[grupo]) groups[grupo] = [];
      groups[grupo].push(pos);
    });
    Object.keys(groups).forEach((grupo) => {
      groups[grupo].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if ((b.dg || 0) !== (a.dg || 0)) return (b.dg || 0) - (a.dg || 0);
        return (b.gf || 0) - (a.gf || 0);
      });
    });
    return groups;
  };

  const handleUpdatePartido = async (status = null) => {
    try {
      // Combinar fecha y hora
      const combinedDate = new Date(fecha);
      combinedDate.setHours(hora.getHours());
      combinedDate.setMinutes(hora.getMinutes());
      combinedDate.setSeconds(0);

      const pad = (n) => (n < 10 ? '0' + n : n);
      const formattedDate = `${combinedDate.getFullYear()}-${pad(combinedDate.getMonth() + 1)}-${pad(combinedDate.getDate())} ${pad(combinedDate.getHours())}:${pad(combinedDate.getMinutes())}:${pad(combinedDate.getSeconds())}`;

      const dataToUpdate = {
        puntos_local: scoreLocal !== "" ? scoreLocal : null,
        puntos_visitante: scoreVisitante !== "" ? scoreVisitante : null,
        fecha: formattedDate,
        lugar: lugar || null,
      };

      if (status) {
        dataToUpdate.estado = status;
      }

      await actualizarPartidoService(selectedPartido.id, dataToUpdate);
      setModalVisible(false);
      cargarFase();
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar el partido");
    }
  };

  const renderPartido = (partido) => {
    const localName = partido.equipo_local_nombre || "Por Definir / Descanso";
    const visName = partido.equipo_visitante_nombre || "Por Definir / Descanso";

    return (
      <View
        key={partido.id}
        className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 mb-3"
      >
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-gray-500 uppercase font-bold">
            {partido.estado}
          </Text>
          {partido.jornada && (
            <Text className="text-xs text-indigo-500 font-bold">
              Jornada {partido.jornada}
            </Text>
          )}
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 items-end pr-3">
            <Text
              className="text-sm font-semibold text-[#1a1a1a] dark:text-white mb-1"
              numberOfLines={2}
            >
              {localName}
            </Text>
          </View>
          <View className="bg-gray-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg flex-row">
            <Text className="font-bold text-lg dark:text-white">
              {partido.puntos_local ?? "-"}
            </Text>
            <Text className="font-bold text-lg mx-2 text-gray-400">-</Text>
            <Text className="font-bold text-lg dark:text-white">
              {partido.puntos_visitante ?? "-"}
            </Text>
          </View>
          <View className="flex-1 items-start pl-3">
            <Text
              className="text-sm font-semibold text-[#1a1a1a] dark:text-white mb-1"
              numberOfLines={2}
            >
              {visName}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap mt-2 px-1">
          {(partido.escenario_nombre || partido.lugar) && (
            <View className="flex-row items-center mr-4 mb-1">
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text className="text-[11px] text-gray-500 ml-1 italic" numberOfLines={1}>
                {partido.lugar || partido.escenario_nombre}
              </Text>
            </View>
          )}
          {partido.fecha && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text className="text-[11px] text-gray-500 ml-1">
                {new Date(partido.fecha).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
              </Text>
              <Ionicons name="time-outline" size={14} color="#6b7280" className="ml-2" style={{marginLeft: 8}} />
              <Text className="text-[11px] text-gray-500 ml-1">
                {new Date(partido.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
        </View>

        {esPropietario && partido.estado !== 'finalizado' && (
          <TouchableOpacity
            className="mt-4 bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 py-2 rounded-lg items-center"
            onPress={() => {
              setSelectedPartido(partido);
              setScoreLocal(partido.puntos_local !== null ? String(partido.puntos_local) : "");
              setScoreVisitante(partido.puntos_visitante !== null ? String(partido.puntos_visitante) : "");
              
              const pDate = partido.fecha ? new Date(partido.fecha) : new Date();
              setFecha(pDate);
              setHora(pDate);
              setLugar(partido.lugar || "");
              setModalVisible(true);
            }}
          >
            <Text className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              Editar Encuentro
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFixture = () => {
    if (fase.metodo === "eliminatoria") {
      return (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text className="text-center text-sm text-gray-500 mb-4 mt-2">
            Árbol de Eliminatoria (Llaves)
          </Text>
          {partidos.map(renderPartido)}
        </ScrollView>
      );
    }

    const groups = groupPartidosByGroupAndJornada(partidos);
    const groupKeys = Object.keys(groups).sort(orderGroups);

    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {groupKeys.map((group) => {
          // Determinar el nombre del grupo
          let groupName = `Grupo ${group}`;
          if (fase.metodo === 'grupos' && posiciones.length > 0 && posiciones[0].grupo) {
            // Si tenemos información de grupos del backend, usar el nombre correcto
            const grupoInfo = posiciones.find(p => String(p.grupo) === String(group));
            if (grupoInfo && grupoInfo.grupo_nombre) {
              groupName = grupoInfo.grupo_nombre;
            }
          }

          return (
            <View key={group}>
              {fase.metodo === 'grupos' && groupKeys.length > 1 && (
                <Text className="font-bold text-lg mb-3 mt-4 dark:text-white">
                  {groupName}
                </Text>
              )}
              {Object.keys(groups[group])
                .sort(orderGroups)
                .map((j) => (
                  <View key={`${group}-${j}`}>
                    <Text className="font-semibold text-sm mb-2 dark:text-neutral-200">
                      Jornada {j}
                    </Text>
                    {groups[group][j].map(renderPartido)}
                  </View>
                ))}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderPosiciones = () => {
    if (fase.metodo === 'grupos') {
      // Si las posiciones ya vienen agrupadas del backend, usar esa estructura
      if (posiciones.length > 0 && posiciones[0].grupo) {
        const gruposAgrupados = {};
        posiciones.forEach(pos => {
          const grupoKey = pos.grupo;
          if (!gruposAgrupados[grupoKey]) {
            gruposAgrupados[grupoKey] = {
              nombre: pos.grupo_nombre,
              posiciones: []
            };
          }
          gruposAgrupados[grupoKey].posiciones.push(pos);
        });

        return (
          <View className="space-y-6">
            {Object.keys(gruposAgrupados).sort(orderGroups).map((groupKey) => {
              const grupo = gruposAgrupados[groupKey];
              return (
                <View key={groupKey} className="bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 overflow-hidden">
                  <View className="px-4 py-3 border-b border-[#eaeaea] dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900">
                    <Text className="text-sm font-semibold text-[#1a1a1a] dark:text-white">{grupo.nombre}</Text>
                  </View>
                  <View className="flex-row bg-gray-100 dark:bg-neutral-900 p-3 border-b border-[#eaeaea] dark:border-neutral-700">
                    <Text className="flex-[3] font-bold text-xs text-gray-600 dark:text-gray-400">Equipo</Text>
                    <Text className="flex-1 font-bold text-xs text-center text-gray-600 dark:text-gray-400">PJ</Text>
                    <Text className="flex-1 font-bold text-xs text-center text-gray-600 dark:text-gray-400">DG</Text>
                    <Text className="flex-1 font-bold text-xs text-center text-indigo-600 dark:text-indigo-400">PTS</Text>
                  </View>
                  {grupo.posiciones.map((pos, index) => (
                    <View
                      key={`${groupKey}-${pos.equipo_id}-${index}`}
                      className="flex-row p-3 border-b border-[#eaeaea] dark:border-neutral-700 items-center"
                    >
                      <Text className="flex-[3] font-semibold text-sm text-[#1a1a1a] dark:text-white" numberOfLines={1}>
                        {index + 1}. {pos.nombre}
                      </Text>
                      <Text className="flex-1 text-sm text-center text-gray-600 dark:text-gray-300">{pos.pj}</Text>
                      <Text className="flex-1 text-sm text-center text-gray-600 dark:text-gray-300">{pos.dg > 0 ? `+${pos.dg}` : pos.dg}</Text>
                      <Text className="flex-1 font-bold text-sm text-center text-indigo-600 dark:text-indigo-400">{pos.pts}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        );
      }

      // Fallback: usar la lógica anterior si no viene agrupada
      const grouped = groupPosicionesByGroup(posiciones);
      const groupKeys = Object.keys(grouped).sort(orderGroups);
      return (
        <View className="space-y-6">
          {groupKeys.map((group) => (
            <View key={group} className="bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 overflow-hidden">
              <View className="px-4 py-3 border-b border-[#eaeaea] dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900">
                <Text className="text-sm font-semibold text-[#1a1a1a] dark:text-white">Grupo {group}</Text>
              </View>
              <View className="flex-row bg-gray-100 dark:bg-neutral-900 p-3 border-b border-[#eaeaea] dark:border-neutral-700">
                <Text className="flex-[3] font-bold text-xs text-gray-600 dark:text-gray-400">Equipo</Text>
                <Text className="flex-1 font-bold text-xs text-center text-gray-600 dark:text-gray-400">PJ</Text>
                <Text className="flex-1 font-bold text-xs text-center text-gray-600 dark:text-gray-400">DG</Text>
                <Text className="flex-1 font-bold text-xs text-center text-indigo-600 dark:text-indigo-400">PTS</Text>
              </View>
              {grouped[group].map((pos, index) => (
                <View
                  key={`${group}-${pos.equipo_id}-${index}`}
                  className="flex-row p-3 border-b border-[#eaeaea] dark:border-neutral-700 items-center"
                >
                  <Text className="flex-[3] font-semibold text-sm text-[#1a1a1a] dark:text-white" numberOfLines={1}>
                    {index + 1}. {pos.nombre}
                  </Text>
                  <Text className="flex-1 text-sm text-center text-gray-600 dark:text-gray-300">{pos.pj}</Text>
                  <Text className="flex-1 text-sm text-center text-gray-600 dark:text-gray-300">{pos.dg > 0 ? `+${pos.dg}` : pos.dg}</Text>
                  <Text className="flex-1 font-bold text-sm text-center text-indigo-600 dark:text-indigo-400">{pos.pts}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    }

    return (
      <View className="bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 overflow-hidden">
        <View className="flex-row bg-gray-100 dark:bg-neutral-900 p-3 border-b border-[#eaeaea] dark:border-neutral-700">
          <Text className="flex-[3] font-bold text-xs text-gray-600 dark:text-gray-400">Equipo</Text>
          <Text className="flex-1 font-bold text-xs text-center text-gray-600 dark:text-gray-400">PJ</Text>
          <Text className="flex-1 font-bold text-xs text-center text-gray-600 dark:text-gray-400">DG</Text>
          <Text className="flex-1 font-bold text-xs text-center text-indigo-600 dark:text-indigo-400">PTS</Text>
        </View>
        {posiciones.map((pos, index) => (
          <View
            key={pos.equipo_id}
            className="flex-row p-3 border-b border-[#eaeaea] dark:border-neutral-700 items-center"
          >
            <Text className="flex-[3] font-semibold text-sm text-[#1a1a1a] dark:text-white" numberOfLines={1}>
              {index + 1}. {pos.nombre}
            </Text>
            <Text className="flex-1 text-sm text-center text-gray-600 dark:text-gray-300">{pos.pj}</Text>
            <Text className="flex-1 text-sm text-center text-gray-600 dark:text-gray-300">{pos.dg > 0 ? `+${pos.dg}` : pos.dg}</Text>
            <Text className="flex-1 font-bold text-sm text-center text-indigo-600 dark:text-indigo-400">{pos.pts}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
      className="bg-[#fafafa] dark:bg-neutral-900"
    >
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginRight: 12,
              padding: 4,
              borderRadius: 999,
              backgroundColor: isDarkMode ? "#1a1a1a" : "#fafafa",
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#1a1a1a"
              className="dark:text-white"
            />
          </TouchableOpacity>
          <View>
            <Text
              className="text-lg font-semibold text-[#1a1a1a] dark:text-white flex-1"
              numberOfLines={1}
            >
              Fase: {fase?.nombre}
            </Text>
            <Text className="text-sm text-gray-500 capitalize">
              {fase?.metodo}
            </Text>
          </View>
        </View>

        {fase?.metodo !== "eliminatoria" && (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#e5e7eb", // Default gray
              backgroundColor:
                Platform.OS === "android" ? "#e5e7eb" : undefined, // Fallback for android if className fails
              borderRadius: 8,
              padding: 4,
              marginBottom: 20,
            }}
            className="bg-gray-200 dark:bg-neutral-800"
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 6,
                alignItems: "center",
                backgroundColor:
                  activeTab === "fixture" ? "#ffffff" : "transparent",
                backgroundColor:
                  activeTab === "fixture"
                    ? Platform.OS === "android"
                      ? "#ffffff"
                      : undefined
                    : "transparent",
              }}
              onPress={() => setActiveTab("fixture")}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: activeTab === "fixture" ? "#4f46e5" : "#6b7280",
                }}
                className={`${activeTab === "fixture" ? "text-indigo-600 dark:text-white" : "text-gray-500"}`}
              >
                Fixture
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 6,
                alignItems: "center",
                backgroundColor:
                  activeTab === "posiciones" ? "#ffffff" : "transparent",
              }}
              onPress={() => setActiveTab("posiciones")}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: activeTab === "posiciones" ? "#4f46e5" : "#6b7280",
                }}
                className={`${activeTab === "posiciones" ? "text-indigo-600 dark:text-white" : "text-gray-500"}`}
              >
                Posiciones
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" className="mt-10" />
        ) : activeTab === "fixture" || fase?.metodo === "eliminatoria" ? (
          renderFixture()
        ) : (
          renderPosiciones()
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <View className="bg-white dark:bg-neutral-800 w-[90%] rounded-2xl p-6 shadow-xl max-h-[90%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-lg font-bold text-center mb-4 text-[#1a1a1a] dark:text-white">
                Editar Encuentro
              </Text>

              {/* Fecha y Hora */}
              <Text className="text-xs font-bold text-gray-500 mb-2 uppercase">Programación</Text>
              <View className="flex-row space-x-2 mb-4">
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(true)}
                  className="flex-1 bg-gray-100 dark:bg-neutral-900 p-3 rounded-xl border border-gray-200 dark:border-neutral-700 flex-row items-center justify-between"
                >
                  <Text className="dark:text-white text-sm">{fecha.toLocaleDateString()}</Text>
                  <Ionicons name="calendar-outline" size={18} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowTimePicker(true)}
                  className="flex-1 bg-gray-100 dark:bg-neutral-900 p-3 rounded-xl border border-gray-200 dark:border-neutral-700 flex-row items-center justify-between"
                >
                  <Text className="dark:text-white text-sm">
                    {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Ionicons name="time-outline" size={18} color="#6366f1" />
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setFecha(selectedDate);
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={hora}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) setHora(selectedDate);
                  }}
                />
              )}

              {/* Lugar (Textarea) */}
              <Text className="text-xs font-bold text-gray-500 mb-2 uppercase">Lugar / Dirección</Text>
              <TextInput
                className="bg-gray-100 dark:bg-neutral-900 p-3 rounded-xl border border-gray-200 dark:border-neutral-700 mb-6 dark:text-white text-sm"
                placeholder="Ej: Cancha del barrio, Calle 123..."
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                value={lugar}
                onChangeText={setLugar}
                style={{ minHeight: 80 }}
              />

              {/* Marcadores */}
              <Text className="text-xs font-bold text-gray-500 mb-2 uppercase">Marcador Actual</Text>
              <View className="flex-row justify-around items-center mb-8">
                <View className="items-center flex-1">
                  <Text className="text-[10px] text-gray-400 mb-1 font-bold text-center" numberOfLines={1}>
                    {selectedPartido?.equipo_local_nombre || "LOCAL"}
                  </Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-neutral-900 w-16 h-16 rounded-xl text-center text-2xl font-bold dark:text-white border border-gray-200 dark:border-neutral-700"
                    keyboardType="numeric"
                    value={scoreLocal}
                    onChangeText={setScoreLocal}
                    placeholder="-"
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-300 mx-2">-</Text>
                <View className="items-center flex-1">
                  <Text className="text-[10px] text-gray-400 mb-1 font-bold text-center" numberOfLines={1}>
                    {selectedPartido?.equipo_visitante_nombre || "VISITANTE"}
                  </Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-neutral-900 w-16 h-16 rounded-xl text-center text-2xl font-bold dark:text-white border border-gray-200 dark:border-neutral-700"
                    keyboardType="numeric"
                    value={scoreVisitante}
                    onChangeText={setScoreVisitante}
                    placeholder="-"
                  />
                </View>
              </View>

              {/* Botones de Acción */}
              <View className="space-y-3">
                <TouchableOpacity
                  className="bg-indigo-600 py-3 rounded-xl items-center shadow-sm"
                  onPress={() => handleUpdatePartido()}
                >
                  <Text className="text-white font-bold">Guardar Cambios</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-emerald-600 py-3 rounded-xl items-center shadow-sm"
                  onPress={() => {
                    Alert.alert(
                      "Finalizar Partido",
                      "¿Estás seguro? Esto bloqueará el resultado para usuarios normales y actualizará las tablas/llaves.",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { 
                          text: "Sí, Finalizar", 
                          onPress: () => handleUpdatePartido('finalizado'),
                          style: "destructive"
                        }
                      ]
                    );
                  }}
                >
                  <Text className="text-white font-bold">Finalizar Partido</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 rounded-xl items-center"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-500 dark:text-gray-400 font-semibold">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

export default FixtureFaseScreen;
