import * as Notifications from 'expo-notifications';

/**
 * Dispara una notificación local inmediata en el dispositivo.
 * Útil para simular push notifications cuando llega un mensaje por Socket.
 */
export async function showLocalNotification(title, body, data = {}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: 'default',
        priority: Notifications.AndroidImportance.MAX,
      },
      trigger: null, // Envío inmediato
    });
  } catch (error) {
    console.error('Error mostrando notificación local:', error);
  }
}
