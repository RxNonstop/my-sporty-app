import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [urlFoto, setUrlFoto] = useState("");
  const [sexo, setSexo] = useState("M");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRegister = async () => {
    setFieldErrors({}); // Clear previous errors

    if (!nombre || !correo || !cedula || !password || !confirmPassword) {
      return Alert.alert(
        "Error",
        "Todos los campos obligatorios deben estar presentes",
      );
    }

    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    setLoading(true);
    const formattedFecha = fechaNacimiento.toISOString().split("T")[0];

    try {
      const data = {
        nombre,
        correo,
        cedula,
        password,
        sexo,
        url_foto_perfil: urlFoto || null,
        fecha_nacimiento: formattedFecha,
      };

      const res = await register(data);
      if (res) {
        Alert.alert("Éxito", "¡Te has registrado correctamente!");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("[RegisterScreen] Error en registro:", error);

      if (error.response?.data?.errors) {
        // Handle express-validator errors: [{correo: "msg"}, {password: "msg"}]
        const newErrors = {};
        error.response.data.errors.forEach((errObj) => {
          const key = Object.keys(errObj)[0];
          newErrors[key] = errObj[key];
        });
        setFieldErrors(newErrors);
      } else if (error.response?.data?.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado. Intente de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    key,
    label,
    value,
    setter,
    placeholder,
    icon,
    secure = false,
    keyboardType = "default",
  ) => (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 dark:text-neutral-300 ml-1 mb-2">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-white dark:bg-neutral-800 border ${fieldErrors[key] ? "border-red" : "border-gray-200 dark:border-neutral-700"} rounded-2xl px-4 py-3 shadow-sm`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={fieldErrors[key] ? "#ef4444" : "#6b7280"}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={(val) => {
            setter(val);
            if (fieldErrors[key]) {
              const newErrors = { ...fieldErrors };
              delete newErrors[key];
              setFieldErrors(newErrors);
            }
          }}
          className="flex-1 ml-3 text-gray-900 dark:text-white"
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
      {fieldErrors[key] && (
        <Text className="text-red text-xs mt-1 ml-2">{fieldErrors[key]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className={isDarkMode ? "bg-neutral-900" : "bg-gray-50"}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-8 pt-12 pb-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-8 w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-sm"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? "#fff" : "#111827"}
            />
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crea tu cuenta
            </Text>
            <Text className="text-gray-500 dark:text-neutral-400">
              Únete a la mejor comunidad deportiva
            </Text>
          </View>

          <View className="space-y-4">
            {renderInput(
              "nombre",
              "Nombre Completo *",
              nombre,
              setNombre,
              "Juan Pérez",
              "person-outline",
            )}
            {renderInput(
              "cedula",
              "Cédula / ID *",
              cedula,
              setCedula,
              "123456789",
              "card-outline",
              false,
              "numeric",
            )}
            {renderInput(
              "correo",
              "Email *",
              correo,
              setCorreo,
              "tu@correo.com",
              "mail-outline",
              false,
              "email-address",
            )}

            {/* Custom Gender Toggle */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-neutral-300 ml-1 mb-2">
                Sexo *
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: isDarkMode ? "#262626" : "#e5e7eb",
                  padding: 4,
                  borderRadius: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSexo("M")}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: sexo === "M" ? "#2563eb" : "transparent",
                  }}
                >
                  <Ionicons
                    name="male"
                    size={18}
                    color={sexo === "M" ? "#fff" : "#6b7280"}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontWeight: "bold",
                      color: sexo === "M" ? "#fff" : "#6b7280",
                    }}
                  >
                    Masculino
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSexo("F")}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: sexo === "F" ? "#db2777" : "transparent",
                  }}
                >
                  <Ionicons
                    name="female"
                    size={18}
                    color={sexo === "F" ? "#fff" : "#6b7280"}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontWeight: "bold",
                      color: sexo === "F" ? "#fff" : "#6b7280",
                    }}
                  >
                    Femenino
                  </Text>
                </TouchableOpacity>
              </View>
              {fieldErrors.sexo && (
                <Text className="text-red text-xs mt-1 ml-2">
                  {fieldErrors.sexo}
                </Text>
              )}
            </View>

            {renderInput(
              "password",
              "Contraseña *",
              password,
              setPassword,
              "••••••••",
              "lock-closed-outline",
              true,
            )}
            {renderInput(
              "confirmPassword",
              "Confirmar Contraseña *",
              confirmPassword,
              setConfirmPassword,
              "••••••••",
              "lock-closed-outline",
              true,
            )}

            {/* Cross-platform Birthdate Picker */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-neutral-300 ml-1 mb-2">
                Fecha de Nacimiento *
              </Text>

              {Platform.OS === "web" ? (
                <View
                  className={`flex-row items-center bg-white dark:bg-neutral-800 border ${fieldErrors.fecha_nacimiento ? "border-red" : "border-gray-200 dark:border-neutral-700"} rounded-2xl px-4 py-3 shadow-sm`}
                >
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                  <input
                    type="date"
                    value={fechaNacimiento.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFechaNacimiento(new Date(e.target.value))
                    }
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      backgroundColor: "transparent",
                      border: "none",
                      color: isDarkMode ? "#fff" : "#000",
                      outline: "none",
                      fontSize: 16,
                      fontFamily: "inherit",
                    }}
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setMostrarFecha(true)}
                    className={`flex-row items-center bg-white dark:bg-neutral-800 border ${fieldErrors.fecha_nacimiento ? "border-red" : "border-gray-200 dark:border-neutral-700"} rounded-2xl px-4 py-4 shadow-sm`}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#6b7280"
                    />
                    <Text className="flex-1 ml-3 text-gray-900 dark:text-white">
                      {fechaNacimiento.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </TouchableOpacity>
                  {mostrarFecha && (
                    <DateTimePicker
                      value={fechaNacimiento}
                      mode="date"
                      display={
                        Platform.OS === "android" ? "calendar" : "spinner"
                      }
                      onChange={(_, selectedDate) => {
                        setMostrarFecha(false);
                        if (selectedDate) setFechaNacimiento(selectedDate);
                      }}
                    />
                  )}
                </>
              )}
              {fieldErrors.fecha_nacimiento && (
                <Text className="text-red text-xs mt-1 ml-2">
                  {fieldErrors.fecha_nacimiento}
                </Text>
              )}
            </View>

            {renderInput(
              "url_foto_perfil",
              "URL Foto de Perfil (Opcional)",
              urlFoto,
              setUrlFoto,
              "https://...",
              "image-outline",
            )}
          </View>

          <TouchableOpacity
            className="bg-blue-600 rounded-2xl py-4 mt-8 shadow-lg shadow-blue-500/30 items-center"
            onPress={handleRegister}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8 mb-6">
            <Text className="text-gray-500 dark:text-neutral-400">
              ¿Ya tienes cuenta?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-blue-600 font-bold">Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
