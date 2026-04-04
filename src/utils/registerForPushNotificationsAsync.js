import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Constants.appOwnership === 'expo') {
    console.log('⚠️ Expo Go no soporta push notifications (SDK 53)');
    return null;
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('¡Fallo al obtener el token para notificaciones push!');
      return;
    }
    
    // El projectId es necesario para Expo 48+
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;

    try{

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('[Push] Token obtenido:', token);
    } catch (error) {
      console.log('Error obteniendo token:', error);
      return null;
    }   
  } else {
    console.log('[Push] Debes usar un dispositivo físico para notificaciones push');
  }

  return token;
}
