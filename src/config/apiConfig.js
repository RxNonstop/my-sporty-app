import { Platform } from "react-native";

/**
 * API Configuration based on platform:
 * - Web: localhost
 * - Android Emulator: 10.0.2.2 (special host alias in emulator)
 * - Android Physical Device: 192.168.1.38 (machine's IP on network)
 * - iOS Simulator: localhost
 */

let API_BASE_URL;

if (Platform.OS === "web") {
  // Web platform - uses localhost
  API_BASE_URL = "https://my-sporty-api.onrender.com/api";
} else if (Platform.OS === "android") {
  // Android platform
  if (__DEV__) {
    // Android Emulator: use 10.0.2.2 (special host alias)
    // Android Physical Device: use your machine IP (e.g., 192.168.1.38)
    API_BASE_URL = "https://my-sporty-api.onrender.com/api";
  } else {
    // Production build
    API_BASE_URL = "https://my-sporty-api.onrender.com/api";
  }
} else if (Platform.OS === "ios") {
  // iOS platform
  API_BASE_URL = "https://my-sporty-api.onrender.com/api";
} else {
  // Default fallback
  API_BASE_URL = "https://my-sporty-api.onrender.com/api";
}

console.log(`[API Config] Platform: ${Platform.OS}, API URL: ${API_BASE_URL}`);

export default API_BASE_URL;
