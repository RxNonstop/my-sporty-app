import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getEquiposService } from '../services/equipoService';
import { getAmigos } from '../services/amistadService';
import { getCampeonatosParticipando } from '../services/eventoService';

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatItem = ({ icon, label, value, color, loading }) => (
  <View className="flex-1 items-center bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-gray-100 dark:border-neutral-700 shadow-sm">
    <View className={`w-10 h-10 rounded-full items-center justify-center mb-2`} style={{ backgroundColor: color + '15' }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    {loading
      ? <ActivityIndicator size="small" color={color} />
      : <Text className="text-lg font-extrabold text-gray-900 dark:text-white">{value ?? '—'}</Text>
    }
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

// ─── Edit Field ─────────────────────────────────────────────────────────────

const EditField = ({ label, value, onChangeText, placeholder, isDarkMode, keyboardType = 'default' }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? '#525252' : '#9CA3AF'}
      keyboardType={keyboardType}
      style={{
        backgroundColor: isDarkMode ? '#262626' : '#F9FAFB',
        color: isDarkMode ? '#FFFFFF' : '#111827',
        borderWidth: 1,
        borderColor: isDarkMode ? '#404040' : '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
      }}
    />
  </View>
);

// ─── Gender Selector ────────────────────────────────────────────────────────

const GenderSelector = ({ value, onChange, isDarkMode }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
      Género
    </Text>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[{ key: 'M', label: 'Masculino' }, { key: 'F', label: 'Femenino' }].map(option => {
        const active = value === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            onPress={() => onChange(option.key)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              backgroundColor: active ? '#1D4ED8' : (isDarkMode ? '#262626' : '#F9FAFB'),
              borderWidth: 1,
              borderColor: active ? '#1D4ED8' : (isDarkMode ? '#404040' : '#E5E7EB'),
            }}
          >
            <Text style={{ fontWeight: '700', fontSize: 14, color: active ? '#FFFFFF' : (isDarkMode ? '#A3A3A3' : '#6B7280') }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function PerfilScreen({ route, navigation }) {
  const { usuario: authUsuario, updateUsuario } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  const usuarioPerfil = route?.params?.usuarioPerfil;
  const usuario = usuarioPerfil || authUsuario;
  const isSelf = !usuarioPerfil || usuarioPerfil.id === authUsuario?.id;

  // ── stats ──
  const [stats, setStats] = useState({ equipos: null, amigos: null, campeonatos: null });
  const [loadingStats, setLoadingStats] = useState(false);

  // ── edit modal ──
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    fecha_nacimiento: '',
    sexo: 'M',
  });

  // ── load stats ──────────────────────────────────────────────────────────────
  const cargarStats = useCallback(async () => {
    const uid = usuario?.id;
    if (!uid) return;
    setLoadingStats(true);
    try {
      const [equiposRes, amigosRes, campeonatosRes] = await Promise.allSettled([
        getEquiposService(uid),
        getAmigos(uid),
        getCampeonatosParticipando(uid),
      ]);

      const equipos = equiposRes.status === 'fulfilled'
        ? (Array.isArray(equiposRes.value?.data) ? equiposRes.value.data.length : 0)
        : 0;

      const amigos = amigosRes.status === 'fulfilled'
        ? (Array.isArray(amigosRes.value) ? amigosRes.value.length : 0)
        : 0;

      const campeonatos = campeonatosRes.status === 'fulfilled'
        ? (Array.isArray(campeonatosRes.value) ? campeonatosRes.value.length : 0)
        : 0;

      setStats({ equipos, amigos, campeonatos });
    } catch {
      setStats({ equipos: 0, amigos: 0, campeonatos: 0 });
    } finally {
      setLoadingStats(false);
    }
  }, [usuario?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (usuario?.id) cargarStats();
  }, [usuario?.id]); // re-run whenever the profile ID changes

  // ── open edit modal ─────────────────────────────────────────────────────────
  const abrirEdicion = () => {
    setForm({
      nombre: authUsuario?.nombre ?? '',
      telefono: authUsuario?.telefono ?? '',
      fecha_nacimiento: authUsuario?.fecha_nacimiento ?? '',
      sexo: authUsuario?.sexo ?? 'M',
    });
    setModalVisible(true);
  };

  // ── save ────────────────────────────────────────────────────────────────────
  const guardarCambios = async () => {
    if (!form.nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre no puede estar vacío.');
      return;
    }
    setSaving(true);
    try {
      await updateUsuario(form);
      setModalVisible(false);
      Alert.alert('¡Listo!', 'Tu perfil ha sido actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const miembroDesde = (() => {
    if (!usuario?.created_at) return 'N/A';
    const d = new Date(usuario.created_at);
    return d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  })();

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }}>
      <ScrollView style={{ flex: 1 }} className="px-4" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="items-center mt-8 mb-6 relative">
          {usuarioPerfil && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ position: 'absolute', left: 0, top: 0, padding: 8, zIndex: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
          )}

          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-800 shadow-xl overflow-hidden">
              <Image
                source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                className="w-full h-full"
              />
            </View>
            {isSelf && (
              <TouchableOpacity
                style={{ position: 'absolute', bottom: 4, right: 4, backgroundColor: '#1d4ed8', padding: 8, borderRadius: 999, borderWidth: 2, borderColor: '#ffffff' }}
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mt-4">{usuario?.nombre}</Text>
          <Text className="text-sm text-gray-500 dark:text-neutral-400">{usuario?.correo}</Text>

          <View className="mt-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
            <Text className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{usuario?.rol}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          <StatItem icon="trophy-outline" label="Campeonatos" value={stats.campeonatos} color="#1D4ED8" loading={loadingStats} />
          <StatItem icon="shield-outline" label="Equipos" value={stats.equipos} color="#16A34A" loading={loadingStats} />
          <StatItem icon="people-outline" label="Amigos" value={stats.amigos} color="#7C3AED" loading={loadingStats} />
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
            value={usuario?.sexo === 'F' ? 'Femenino' : (usuario?.sexo === 'M' ? 'Masculino' : 'No especificado')}
          />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={usuario?.telefono || "No registrado"}
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
            <Text className="text-gray-900 dark:text-white font-semibold text-sm">{usuario?.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : "No especificada"}</Text>
            <Text className="text-gray-900 dark:text-white font-semibold text-sm">{miembroDesde}</Text>
          </View>
        </View>

        {/* Edit Button */}
        {isSelf && (
          <TouchableOpacity
            onPress={abrirEdicion}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1D4ED8', padding: 16, borderRadius: 24, marginBottom: 40, shadowColor: '#1D4ED8', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text style={{ color: 'white', fontWeight: '700', marginLeft: 8, fontSize: 15 }}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <View className="h-10" />
      </ScrollView>

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => !saving && setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, backgroundColor: isDarkMode ? '#171717' : '#FFFFFF' }}>

            {/* Modal Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? '#262626' : '#F3F4F6',
            }}>
              <TouchableOpacity
                onPress={() => !saving && setModalVisible(false)}
                style={{ padding: 4 }}
              >
                <Text style={{ color: '#6B7280', fontSize: 15, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 17, fontWeight: '700', color: isDarkMode ? '#FFFFFF' : '#111827' }}>
                Editar Perfil
              </Text>

              <TouchableOpacity
                onPress={guardarCambios}
                disabled={saving}
                style={{
                  backgroundColor: '#1D4ED8',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Guardar</Text>
                }
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

              {/* Avatar preview */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', borderWidth: 3, borderColor: '#1D4ED8' }}>
                  <Image
                    source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nombre || 'U')}&background=1D4ED8&color=fff&size=256` }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text style={{ marginTop: 8, fontSize: 12, color: '#6B7280' }}>Vista previa del avatar</Text>
              </View>

              <EditField
                label="Nombre completo"
                value={form.nombre}
                onChangeText={t => setForm(f => ({ ...f, nombre: t }))}
                placeholder="Tu nombre completo"
                isDarkMode={isDarkMode}
              />

              <EditField
                label="Teléfono"
                value={form.telefono}
                onChangeText={t => setForm(f => ({ ...f, telefono: t }))}
                placeholder="+57 300 000 0000"
                isDarkMode={isDarkMode}
                keyboardType="phone-pad"
              />

              <EditField
                label="Fecha de nacimiento (YYYY-MM-DD)"
                value={form.fecha_nacimiento}
                onChangeText={t => setForm(f => ({ ...f, fecha_nacimiento: t }))}
                placeholder="1990-01-15"
                isDarkMode={isDarkMode}
                keyboardType="numeric"
              />

              <GenderSelector
                value={form.sexo}
                onChange={val => setForm(f => ({ ...f, sexo: val }))}
                isDarkMode={isDarkMode}
              />

              {/* Read-only fields hint */}
              <View style={{
                backgroundColor: isDarkMode ? '#1C2432' : '#EFF6FF',
                borderRadius: 14,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 8,
              }}>
                <Ionicons name="information-circle-outline" size={18} color="#3B82F6" style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={{ flex: 1, fontSize: 13, color: isDarkMode ? '#93C5FD' : '#1D4ED8', lineHeight: 18 }}>
                  El correo electrónico y el rol no se pueden modificar desde esta pantalla.
                </Text>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}