import React, { useEffect, useState } from 'react';
import {

View,
Text,
TextInput,
Button,
FlatList,
StyleSheet,
TouchableOpacity,
Modal,
SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


const FasesCampeonatoScreen = ({ route }) => {
const { campeonato } = route.params || {};
const [fases, setFases] = useState([]);
const [modalVisible, setModalVisible] = useState(false);
const [nuevaFase, setNuevaFase] = useState('');
const [metodoFase, setMetodoFase] = useState('');
const [tamanoGrupo, setTamanoGrupo] = useState('');
const [clasificadosPorGrupo, setClasificadosPorGrupo] = useState('');
const [errorGrupo, setErrorGrupo] = useState('');
useEffect(() => {
  console.log(campeonato);
}, [campeonato]);


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

  setFases([
    ...fases,
    { 
      nombre: nuevaFase.trim(), 
      metodo: metodoFase,
      equiposIniciales: equiposAnteriores,
      equiposRestantes,
      ...(metodoFase === "grupos" && { 
        tamanoGrupo, 
        clasificadosPorGrupo 
      })
    }
  ]);
  
  setNuevaFase('');
  setMetodoFase('');
  setTamanoGrupo('');
  setClasificadosPorGrupo('');
  setErrorGrupo('');
  setModalVisible(false);
};

if (!campeonato) {
  return <Text>No se encontró el campeonato.</Text>;
}

const eliminarFase = (indexEliminar) => {
  setFases(fases.filter((_, idx) => idx !== indexEliminar));
};

  const renderBadge = (text, color) => (
    <View style={{ backgroundColor: color + '15' }} className="px-2 py-1 rounded mr-2 mb-2 dark:bg-opacity-20">
      <Text style={{ color }} className="text-xs font-semibold dark:opacity-90">{text}</Text>
    </View>
  );

  const isCampeonato = campeonato?.tipo !== 'partido';

  return (
    <SafeAreaView className="flex-1 bg-[#fafafa] dark:bg-neutral-900">
      <View className="flex-1 px-5 pt-4 bg-[#fafafa] dark:bg-neutral-900">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1 rounded-full dark:bg-neutral-800">
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" className="dark:text-white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-[#1a1a1a] dark:text-white flex-1" numberOfLines={1}>
            {campeonato?.nombre || "Sin nombre"}
          </Text>
        </View>

        <FlatList
          data={fases}
          keyExtractor={(_, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View className="bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 p-4 mb-6">
                {campeonato?.descripcion ? (
                  <Text className="text-sm text-[#6a6a6a] dark:text-neutral-400 mb-4 leading-5">{campeonato.descripcion}</Text>
                ) : null}
                
                <View className="flex-row flex-wrap mb-4">
                  {renderBadge(campeonato?.estado || "borrador", campeonato?.estado === 'activo' || campeonato?.estado === 'publicado' ? '#28a745' : '#6c757d')}
                  {renderBadge(campeonato?.privacidad || "público", '#007bff')}
                  {campeonato?.inscripciones_abiertas === '1' && renderBadge('Inscripciones abiertas', '#28a745')}
                </View>

                <View className="flex-row flex-wrap justify-between">
                  <View className="w-[48%] mb-3">
                    <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">ID</Text>
                    <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonato?.id || "-"}</Text>
                  </View>
                  <View className="w-[48%] mb-3">
                    <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Deporte</Text>
                    <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200 capitalize">{campeonato?.deporte || "-"}</Text>
                  </View>
                  <View className="w-[48%] mb-3">
                    <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Jugadores</Text>
                    <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonato?.numero_jugadores || "0"} / {campeonato?.numero_suplentes || "0"} sup</Text>
                  </View>
                  <View className="w-[48%] mb-3">
                    <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Inicia</Text>
                    <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonato?.fecha_inicio || "-"}</Text>
                  </View>
                  
                  {isCampeonato && (
                    <>
                      <View className="w-[48%] mb-3">
                        <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Termina</Text>
                        <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonato?.fecha_fin || "-"}</Text>
                      </View>
                      <View className="w-[48%] mb-3">
                        <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Equipos</Text>
                        <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonato?.numero_equipos || "0"}</Text>
                      </View>
                    </>
                  )}
                  {campeonato?.telefono_contacto ? (
                    <View className="w-[48%] mb-3">
                      <Text className="text-[11px] text-[#8a8a8a] dark:text-neutral-500 mb-1 uppercase tracking-wider">Contacto</Text>
                      <Text className="text-[13px] font-medium text-[#1a1a1a] dark:text-neutral-200">{campeonato?.telefono_contacto}</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <Text className="text-base font-semibold text-[#1a1a1a] dark:text-white mb-3">Fases del campeonato</Text>
            </>
          }
          renderItem={({ item, index }) => (
            <View className="flex-row items-center p-4 bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 mb-3">
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200 mb-1">{index + 1}. {item.nombre}</Text>
                <Text className="text-[13px] text-[#6a6a6a] dark:text-neutral-400 mt-[2px]">
                  Método: <Text className="font-medium text-[#1a1a1a] dark:text-neutral-300 capitalize">{item.metodo}</Text>
                  {item.metodo === "grupos" && ` (Grupos de ${item.tamanoGrupo})`}
                </Text>
                <Text className="text-[13px] text-[#6a6a6a] dark:text-neutral-400 mt-[2px]">
                  Equipos: {item.equiposIniciales} → {item.equiposRestantes}
                </Text>
              </View>
              <TouchableOpacity onPress={() => eliminarFase(index)} className="p-2">
                <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View className="p-6 items-center bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 border-dashed">
              <Text className="text-sm text-[#8a8a8a] dark:text-neutral-400">No hay fases agregadas aún.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

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
                        <Picker.Item key={idx} label={`${div}`} value={div.toString()} color="#1a1a1a" />
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