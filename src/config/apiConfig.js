import { Platform } from 'react-native';

/**
 * API Configuration based on platform:
 * - Web: localhost
 * - Android Emulator: 10.0.2.2 (special host alias in emulator)
 * - Android Physical Device: 192.168.1.38 (machine's IP on network)
 * - iOS Simulator: localhost
 */

let API_BASE_URL;

if (Platform.OS === 'web') {
  // Web platform - uses localhost
  API_BASE_URL = 'http://localhost/api-DeportProyect/api/index.php';
} else if (Platform.OS === 'android') {
  // Android platform
  if (__DEV__) {
    // In development, assume physical device on same network
    // Change this to '10.0.2.2' if using Android Emulator
    API_BASE_URL = 'http://192.168.1.38/api-DeportProyect/api/index.php';
  } else {
    // Production build
    API_BASE_URL = 'http://192.168.1.38/api-DeportProyect/api/index.php';
  }
} else if (Platform.OS === 'ios') {
  // iOS platform
  API_BASE_URL = 'http://localhost/api-DeportProyect/api/index.php';
} else {
  // Default fallback
  API_BASE_URL = 'http://192.168.1.38/api-DeportProyect/api/index.php';
}

console.log(`[API Config] Platform: ${Platform.OS}, API URL: ${API_BASE_URL}`);

export default API_BASE_URL;
