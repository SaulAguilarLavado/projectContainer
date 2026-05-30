/**
 * Servicio centralizado de API
 * Conecta con el backend FastAPI en http://localhost:8000
 */

const BASE_URL = 'http://localhost:8000';

// Endpoints disponibles
export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  USUARIOS: `${BASE_URL}/usuarios`,
  REPAIRS: `${BASE_URL}/reparaciones`, // Futuro
  PRODUCTS: `${BASE_URL}/productos`,   // Futuro
  HEALTH: `${BASE_URL}/health`
};

/**
 * Login de usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Respuesta con datos del usuario
 */
export const loginUsuario = async (username, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error en el login');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    throw error;
  }
};

/**
 * Obtener lista de reparaciones (usando /todos como simulación)
 */
export const getRepairs = async () => {
  try {
    // Temporal: usando JSONPlaceholder hasta que el backend tenga el endpoint
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
    if (!response.ok) throw new Error('Error al obtener reparaciones');

    const data = await response.json();

    // Transformar datos para el formato esperado
    return data.map((item, index) => ({
      id: item.id.toString(),
      client: `Cliente ${item.userId}`,
      item: item.title.substring(0, 30),
      status: item.completed ? 'Completado' : (index % 2 === 0 ? 'En Proceso' : 'Pendiente'),
      date: `${15 + index}/10`
    }));
  } catch (error) {
    console.error('Error en getRepairs:', error);
    throw error;
  }
};

/**
 * Obtener lista de productos (usando /posts como simulación)
 */
export const getProducts = async () => {
  try {
    // Temporal: usando JSONPlaceholder hasta que el backend tenga el endpoint
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
    if (!response.ok) throw new Error('Error al obtener productos');

    const data = await response.json();

    // Transformar datos para el formato esperado
    return data.map((item, index) => ({
      id: item.id,
      name: item.title.substring(0, 25),
      price: (Math.random() * 50).toFixed(2),
      stock: Math.floor(Math.random() * 100)
    }));
  } catch (error) {
    console.error('Error en getProducts:', error);
    throw error;
  }
};

/**
 * Registrar usuario temporalmente (en memoria/AsyncStorage)
 * @param {object} userData - {name, email, password}
 * @returns {Promise} Usuario creado
 */
export const registerUsuario = async (userData) => {
  try {
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: 'customer',
      created_at: new Date().toISOString()
    };

    // Aquí se guarda temporalmente (en una app real iría al backend)
    // Por ahora lo retornamos para que se guarde en AsyncStorage
    return newUser;
  } catch (error) {
    console.error('Error en registerUsuario:', error);
    throw error;
  }
};

/**
 * Obtener lista de usuarios registrados (temporales)
 * @returns {Promise} Lista de usuarios
 */
export const getUsuarios = async () => {
  try {
    // Retorna usuarios de ejemplo
    return [
      { id: '1', name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'customer' },
      { id: '2', name: 'María García', email: 'maria@ejemplo.com', role: 'customer' },
      { id: '3', name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'customer' }
    ];
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    throw error;
  }
};

/**
 * Verificar estado de la API
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    if (!response.ok) throw new Error('API no disponible');
    return await response.json();
  } catch (error) {
    console.error('Error verificando salud de API:', error);
    throw error;
  }
};
