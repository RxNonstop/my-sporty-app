import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const navigate = useNavigation()

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [cedula, setCedula ] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [urlFoto, setUrlFoto] = useState('');
  const [sexo, setSexo] = useState('M');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !correo || !password || !confirmPassword) {
      return Alert.alert('Error', 'Todos los campos son obligatorios');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden');
    }

    const formattedFecha = fechaNacimiento.toISOString().split('T')[0];

    try {
      const data = {
        nombre,
        correo,
        cedula,
        password,
        sexo,
        url_foto_perfil: urlFoto || null,
        fecha_nacimiento: formattedFecha
      };

      const res = await register(data);
      if(res){
        navigate.navigate('login')
        Alert.alert('Éxito', 'Registro exitoso');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar. Revisa los datos e intenta nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Cedula"
        value={cedula}
        onChangeText={setCedula}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <Text style={styles.label}>Sexo:</Text>
      <Picker
        selectedValue={sexo}
        onValueChange={(itemValue) => setSexo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Masculino" value="M" />
        <Picker.Item label="Femenino" value="F" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={styles.label}>Fecha de Nacimiento:</Text>
      <Button
        title={fechaNacimiento.toDateString()}
        onPress={() => setMostrarFecha(true)}
      />
      {mostrarFecha && (
        <DateTimePicker
          value={fechaNacimiento}
          mode="date"
          onChange={(_, selectedDate) => {
            setMostrarFecha(false);
            if (selectedDate) setFechaNacimiento(selectedDate);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="URL de foto de perfil (opcional)"
        value={urlFoto}
        onChangeText={setUrlFoto}
      />

      <View style={styles.button}>
        <Button title="Registrarse" onPress={handleRegister} />
      </View>

      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#1D4ED8' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  button: { marginTop: 16 },
  loginText: { marginTop: 20, textAlign: 'center', color: '#2563EB', textDecorationLine: 'underline' },
});