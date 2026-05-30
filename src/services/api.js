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
 * Intenta conectar con backend real primero, fallback a usuarios locales
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @param {array} registeredUsers - Lista de usuarios registrados temporalmente
 * @returns {Promise} Respuesta con datos del usuario
 */
export const loginUsuario = async (username, password, registeredUsers = []) => {
  try {
    // Intentar conectar con el backend real
    console.log('Intentando conectar con backend en:', API_ENDPOINTS.LOGIN);
    
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim()
      }),
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login exitoso con backend:', data);
      
      // Mapear la respuesta del backend al formato esperado
      return {
        usuario: {
          id: data.usuario.id || data.usuario.username,
          name: data.usuario.nombre || data.usuario.email,
          email: data.usuario.email,
          role: data.usuario.role === 'costurera' ? 'admin' : 'customer', // Mapear roles
          username: data.usuario.username
        },
        token: data.token || `token_${data.usuario.id}_${Date.now()}`
      };
    }
  } catch (backendError) {
    console.warn('No se pudo conectar con backend, usando usuarios locales:', backendError);
  }

  // Fallback: Usar usuarios locales
  try {
    // Usuarios de prueba predefinidos
    const testUsers = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Administrador',
        email: 'admin@textilcontrol.com',
        role: 'admin'
      },
      {
        id: '2',
        username: 'cliente1',
        password: 'cliente123',
        name: 'Cliente Demo',
        email: 'cliente@textilcontrol.com',
        role: 'customer'
      }
    ];

    // Buscar en usuarios de prueba
    let foundUser = testUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    // Si no encuentra en prueba, buscar en usuarios registrados temporalmente
    if (!foundUser && registeredUsers && registeredUsers.length > 0) {
      foundUser = registeredUsers.find(
        u => u.email.toLowerCase() === username.toLowerCase() && u.password === password
      );
    }

    // Si no encuentra el usuario, lanzar error
    if (!foundUser) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    console.log('Login exitoso con usuario local:', foundUser.username);

    // Retornar usuario encontrado
    return {
      usuario: {
        id: foundUser.id,
        name: foundUser.name || foundUser.email,
        email: foundUser.email,
        role: foundUser.role || 'customer',
        username: foundUser.username || foundUser.email
      },
      token: `token_${foundUser.id}_${Date.now()}`
    };
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
