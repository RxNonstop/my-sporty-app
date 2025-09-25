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

const agregarFase = () => {
  if (!nuevaFase.trim() || !metodoFase) return;

  const equiposAnteriores = fases.length === 0 
    ? campeonato.numero_equipos
    : fases[fases.length - 1].equiposRestantes;

  let equiposRestantes = equiposAnteriores;

  if (metodoFase === "liga") {
    equiposRestantes = equiposAnteriores;
  } else if (metodoFase === "eliminatoria") {
    equiposRestantes = Math.ceil(equiposAnteriores / 2);
  } else if (metodoFase === "grupos") {
    const grupo = parseInt(tamanoGrupo, 10) || 4; // por defecto 4
    const clasificados = parseInt(clasificadosPorGrupo, 10);
    

    if (!grupo || !clasificados) {
      setErrorGrupo("Debes ingresar valores válidos.");
      return;
    }
    if (clasificados >= grupo) {
      setErrorGrupo("Los clasificados deben ser menores que el tamaño del grupo.");
      return;
    }

    const grupos = Math.floor(equiposAnteriores / grupo);
    equiposRestantes = grupos * clasificadosPorGrupo;
  }

  setFases([
    ...fases,
    { 
      nombre: nuevaFase.trim(), 
      metodo: metodoFase,
      equiposIniciales: equiposAnteriores,
      equiposRestantes,
      ...(metodoFase === "grupos" && { tamanoGrupo }),
      tamanoGrupo, 
      clasificadosPorGrupo 
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

return (
  <View style={styles.container}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginRight: 8 }}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{campeonato?.nombre || "Sin nombre"}</Text>
    </View>
    <Text style={styles.subtitle}>Fases del campeonato:</Text>
    <FlatList
      data={fases}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={({ item, index }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4, padding: 16,backgroundColor: '#f2f2f2',borderRadius: 8, marginBottom: 12, justifyContent: 'space-between' }}>
          <Text style={{ flex: 1 }}>
            {index + 1}. {item.nombre} ({item.metodo})
            {item.metodo === "grupos" && ` - Grupos de ${item.tamanoGrupo}`}
            {"\n"}Equipos: {item.equiposIniciales} → {item.equiposRestantes}
          </Text>
          <TouchableOpacity onPress={() => eliminarFase(index)}>
            <Ionicons name="trash-outline" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text>No hay fases agregadas aún.</Text>}
    />

    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.subtitle}>Agregar nueva fase:</Text>
          <TextInput
            style={styles.input}
            value={nuevaFase}
            onChangeText={setNuevaFase}
            placeholder="Nombre de la fase"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.selectButton,
                metodoFase === 'liga' && styles.selectedButton,
              ]}
              onPress={() => setMetodoFase('liga')}
            >
              <Text>Liga</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectButton,
                metodoFase === 'eliminatoria' && styles.selectedButton,
              ]}
              onPress={() => setMetodoFase('eliminatoria')}
            >
              <Text>Eliminatoria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectButton,
                metodoFase === 'grupos' && styles.selectedButton,
              ]}
              onPress={() => setMetodoFase('grupos')}
            >
              <Text>Fase de grupos</Text>
            </TouchableOpacity>
          </View>
          <Button
            title="Agregar fase"
            onPress={agregarFase}
            disabled={!nuevaFase.trim() || !metodoFase}
          />
          {metodoFase === 'grupos' && (
            <>
              <TextInput
                style={styles.input}
                value={tamanoGrupo}
                onChangeText={setTamanoGrupo}
                placeholder="Tamaño del grupo (ej: 4)"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={clasificadosPorGrupo}
                onChangeText={setClasificadosPorGrupo}
                placeholder="Clasificados por grupo (ej: 2)"
                keyboardType="numeric"
              />
              {errorGrupo ? <Text style={{ color: 'red' }}>{errorGrupo}</Text> : null}
            </>
          )}
          <Button title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>

    <View style={styles.bottomButtonContainer}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Agregar Fase</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: { flex: 1, padding: 16, backgroundColor: '#fff' },
title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
subtitle: { fontSize: 16, fontWeight: '600', marginTop: 18, marginBottom: 8 },
input: {
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 6,
  padding: 8,
  marginBottom: 12,
},
buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
selectButton: {
  padding: 10,
  borderRadius: 6,
  backgroundColor: '#f0f0f0',
  marginHorizontal: 4,
},
selectedButton: { backgroundColor: '#cce5ff' },
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  elevation: 5,
},
bottomButtonContainer: {
  position: 'absolute',
  bottom: 24,
  left: 0,
  right: 0,
  alignItems: 'center',
},
addButton: {
  backgroundColor: '#007bff',
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 30,
  elevation: 2,
},
addButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 17,
},
});

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