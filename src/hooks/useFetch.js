import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook para consumir APIs con manejo de estados
 * @param {string} url - URL de la API a consumir
 * @param {string} storageKey - Clave para almacenar datos localmente
 * @param {boolean} useCache - Si usar AsyncStorage para cachear datos
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetch(url, storageKey = null, useCache = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar del cache primero
      if (useCache && storageKey) {
        const cachedData = await AsyncStorage.getItem(storageKey);
        if (cachedData) {
          setData(JSON.parse(cachedData));
          setLoading(false);
          // Continuar cargando datos frescos en background
        }
      }

      // Llamar a la API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      // Guardar en AsyncStorage si está configurado
      if (useCache && storageKey) {
        await AsyncStorage.setItem(storageKey, JSON.stringify(result));
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error desconocido');
      setLoading(false);
      
      // Si hay error y hay cache, usar el cache
      if (useCache && storageKey) {
        const cachedData = await AsyncStorage.getItem(storageKey);
        if (cachedData) {
          setData(JSON.parse(cachedData));
          setError('Mostrando datos en caché');
        }
      }
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, storageKey]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}
