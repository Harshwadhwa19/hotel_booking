import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// IMPORTANT: Replace 'localhost' with your machine's IP address to test on a physical device.
// Android Emulator uses 10.0.2.2 for host machine.
const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
