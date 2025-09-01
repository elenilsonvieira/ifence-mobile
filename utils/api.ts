import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const envBase = (Constants.expoConfig?.extra as any)?.IFENCE_API_URL as string | undefined;
const DEBUG_HTTP = Boolean((Constants.expoConfig?.extra as any)?.IFENCE_DEBUG_HTTP);
// Ajuste a baseURL conforme ambiente: emulador Android usa 10.0.2.2 para localhost
const DEFAULT_BASE_URL = envBase || 'http://10.0.2.2:8080/api';
// Base raiz (sem o sufixo /api) para endpoints públicos como /login
const ROOT_BASE_URL = DEFAULT_BASE_URL.replace(/\/api\/?$/, '');

let currentToken: string | null = null;

export async function initAuthTokenFromStorage() {
  try {
    currentToken = await AsyncStorage.getItem('authToken');
  } catch {}
}

export async function setAuthToken(token: string | null) {
  currentToken = token;
  try {
    if (token) await AsyncStorage.setItem('authToken', token);
    else await AsyncStorage.removeItem('authToken');
  } catch {}
}

export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 10000,
});

// Cliente para rotas fora de /api (ex.: /login, /isValidToken)
export const authApi = axios.create({
  baseURL: ROOT_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const path = String(config.url ?? '');
  const isLogin = /\blogin\b/.test(path);
  if (currentToken && !isLogin) {
    const headers: Record<string, string> = (config.headers as any) ?? {};
    headers.Authorization = `Bearer ${currentToken}`;
    (config.headers as any) = headers;
  }
  if (DEBUG_HTTP) {
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    const method = (config.method || 'get').toUpperCase();
  const isInteresting = /bracelets|fences|users|login/.test(url);
    if (isInteresting) {
      const auth = (config.headers as any)?.Authorization as string | undefined;
      const masked = auth ? auth.replace(/Bearer\s+(.{0,10}).*/, 'Bearer $1...') : 'none';
      // eslint-disable-next-line no-console
      console.log(`[HTTP-REQ] ${method} ${url} auth=${masked}`);
    }
  }
  return config;
});

authApi.interceptors.request.use((config) => {
  const path = String(config.url ?? '');
  const isLogin = /\blogin\b/.test(path);
  if (currentToken && !isLogin) {
    const headers: Record<string, string> = (config.headers as any) ?? {};
    headers.Authorization = `Bearer ${currentToken}`;
    (config.headers as any) = headers;
  }
  if (DEBUG_HTTP) {
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    const method = (config.method || 'get').toUpperCase();
  const isInteresting = /bracelets|fences|users|login/.test(url);
    if (isInteresting) {
      const auth = (config.headers as any)?.Authorization as string | undefined;
      const masked = auth ? auth.replace(/Bearer\s+(.{0,10}).*/, 'Bearer $1...') : 'none';
      // eslint-disable-next-line no-console
      console.log(`[HTTP-REQ] ${method} ${url} auth=${masked}`);
    }
  }
  return config;
});

export default api;

// Logs de resposta para diagnóstico (sem alterar o fluxo)
api.interceptors.response.use(
  (response) => {
    if (DEBUG_HTTP) {
      const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`;
      const method = (response.config.method || 'get').toUpperCase();
  if (/bracelets|fences|users|login/.test(url)) {
        // eslint-disable-next-line no-console
        console.log(`[HTTP-RES] ${method} ${url} -> ${response.status}`);
      }
    }
    return response;
  },
  (error) => {
    if (DEBUG_HTTP && error?.config) {
      const url = `${error.config.baseURL ?? ''}${error.config.url ?? ''}`;
      const method = (error.config.method || 'get').toUpperCase();
  if (/bracelets|fences|users|login/.test(url)) {
        const status = error?.response?.status;
        // eslint-disable-next-line no-console
        console.log(`[HTTP-ERR] ${method} ${url} -> ${status}`);
      }
    }
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    if (DEBUG_HTTP) {
      const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`;
      const method = (response.config.method || 'get').toUpperCase();
  if (/bracelets|fences|users|login/.test(url)) {
        // eslint-disable-next-line no-console
        console.log(`[HTTP-RES] ${method} ${url} -> ${response.status}`);
      }
    }
    return response;
  },
  (error) => {
    if (DEBUG_HTTP && error?.config) {
      const url = `${error.config.baseURL ?? ''}${error.config.url ?? ''}`;
      const method = (error.config.method || 'get').toUpperCase();
  if (/bracelets|fences|users|login/.test(url)) {
        const status = error?.response?.status;
        // eslint-disable-next-line no-console
        console.log(`[HTTP-ERR] ${method} ${url} -> ${status}`);
      }
    }
    return Promise.reject(error);
  }
);
