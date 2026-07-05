import { Platform } from 'react-native';
import Constants from 'expo-constants';
import logger from '../utils/logger';

const getMetroHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;
  if (hostUri.startsWith('[')) return hostUri.slice(1, hostUri.indexOf(']'));
  return hostUri.split(':')[0];
};

const metroHost = getMetroHost();
const DEFAULT_BASE_URL = metroHost
  ? `http://${metroHost}:8000`
  : Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';

export const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
logger.info('api_base_url_configured', { baseUrl: BASE_URL, source: process.env.EXPO_PUBLIC_API_URL ? 'environment' : 'automatic' });

export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  USUARIOS: '/usuarios',
  REPAIRS: '/reparaciones',
  PRODUCTS: '/productos',
  HEALTH: '/health'
};

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
  const startedAt = Date.now();

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {})
      }
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const detail = data?.detail;
      const message = Array.isArray(detail)
        ? detail.map(item => item.msg).join('. ')
        : detail || `La API respondió con estado ${response.status}`;
      throw new ApiError(message, response.status, data);
    }

    logger.info('api_request_ok', {
      method: options.method || 'GET',
      path,
      durationMs: Date.now() - startedAt
    });
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError(`La solicitud tardó demasiado. No se pudo acceder a ${BASE_URL}.`);
    }
    if (error instanceof ApiError) throw error;
    logger.handled('api_request_failed', error, { path, baseUrl: BASE_URL });
    throw new ApiError(`No se pudo conectar con el servidor en ${BASE_URL}`);
  } finally {
    clearTimeout(timeoutId);
  }
};

const mapUser = user => ({
  id: user.id,
  name: user.nombre,
  email: user.email,
  role: user.role,
  username: user.username,
  active: user.activo
});

const mapRepair = repair => ({
  id: String(repair.id),
  clientId: repair.cliente_id,
  client: repair.cliente,
  item: repair.prenda,
  description: repair.descripcion,
  status: repair.estado,
  date: repair.fecha_entrega,
  cost: repair.costo,
  location: repair.ubicacion,
  photoUrl: repair.foto_url,
  createdAt: repair.creado_en,
  updatedAt: repair.actualizado_en
});

const mapProduct = product => ({
  id: product.id,
  name: product.nombre,
  price: product.precio,
  stock: product.stock,
  description: product.descripcion
});

export const loginUsuario = async (username, password) => {
  const data = await request(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.trim(), password })
  });

  return { usuario: mapUser(data.usuario), token: data.token };
};

export const registerUsuario = async userData => {
  const data = await request(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password
    })
  });
  return mapUser(data.usuario);
};

export const getRepairs = async clientId => {
  const query = clientId ? `?cliente_id=${encodeURIComponent(clientId)}` : '';
  const data = await request(`${API_ENDPOINTS.REPAIRS}${query}`);
  return data.map(mapRepair);
};

export const createRepair = async repair => {
  const form = new FormData();
  form.append('cliente_id', String(repair.clientId));
  form.append('prenda', repair.item.trim());
  form.append('descripcion', repair.description.trim());
  form.append('fecha_entrega', repair.deliveryDate.trim());
  form.append('costo', String(repair.cost));
  form.append('ubicacion', repair.location.trim().toUpperCase());

  if (repair.photoUri) {
    const rawName = repair.photoUri.split('/').pop() || `evidencia-${Date.now()}.jpg`;
    const extension = rawName.split('.').pop()?.toLowerCase();
    const type = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
    form.append('foto', { uri: repair.photoUri, name: rawName, type });
  }

  const data = await request(API_ENDPOINTS.REPAIRS, {
    method: 'POST',
    body: form,
    timeout: 20000
  });
  return mapRepair(data);
};

export const updateRepairStatus = async (repairId, status) => {
  const data = await request(`${API_ENDPOINTS.REPAIRS}/${repairId}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: status })
  });
  return mapRepair(data);
};

export const getProducts = async () => {
  const data = await request(API_ENDPOINTS.PRODUCTS);
  return data.map(mapProduct);
};

export const createProduct = async product => {
  const data = await request(API_ENDPOINTS.PRODUCTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: product.name.trim(),
      precio: Number(product.price),
      stock: Number(product.stock),
      descripcion: product.description.trim()
    })
  });
  return mapProduct(data);
};

export const updateProduct = async (productId, product) => {
  const data = await request(`${API_ENDPOINTS.PRODUCTS}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: product.name.trim(),
      precio: Number(product.price),
      stock: Number(product.stock),
      descripcion: product.description.trim()
    })
  });
  return mapProduct(data);
};

export const deleteProduct = productId => request(`${API_ENDPOINTS.PRODUCTS}/${productId}`, {
  method: 'DELETE'
});

export const getUsuarios = async () => {
  const data = await request(API_ENDPOINTS.USUARIOS);
  return data.map(mapUser);
};

export const checkHealth = () => request(API_ENDPOINTS.HEALTH);
