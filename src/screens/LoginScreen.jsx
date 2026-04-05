import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setLoginError("");
    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
      setLoginError("Credenciales inválidas. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Banner Section */}
        <View className="h-64 w-full relative">
          <Image 
            source={require("../../assets/sports_banner_auth.png")} // Use the generated asset
            className="h-full w-full"
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
          />
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <Text className="text-4xl font-bold text-white tracking-widest uppercase">My Sporty</Text>
            <View className="h-1 w-20 bg-blue-500 mt-2 rounded-full" />
          </View>
        </View>

        {/* Login Form */}
        <View className="flex-1 px-8 -mt-10 bg-gray-50 dark:bg-neutral-900 rounded-t-[40px] pt-10">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido</Text>
            <Text className="text-gray-500 dark:text-neutral-400">Inicia sesión para continuar con tu pasión</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-semibold text-gray-700 dark:text-neutral-300 ml-1 mb-2">Email</Text>
              <View className="flex-row items-center bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 shadow-sm">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  placeholder="tu@correo.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  className="flex-1 ml-3 text-gray-900 dark:text-white"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-700 dark:text-neutral-300 ml-1 mb-2">Contraseña</Text>
              <View className="flex-row items-center bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 shadow-sm">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 ml-3 text-gray-900 dark:text-white"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {loginError ? (
            <View className="dark:border-red/40 rounded-xl p-3 mt-4">
              <Text className="text-red dark:text-red text-sm text-center font-medium">{loginError}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={{ backgroundColor: '#2563eb', borderRadius: 16, paddingVertical: 16, marginTop: 32, alignItems: 'center', shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg">{loading ? "Cargando..." : "Ingresar"}</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-10 mb-6">
            <Text className="text-gray-500 dark:text-neutral-400">¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ padding: 2 }}>
              <Text className="text-blue-600 font-bold">Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
