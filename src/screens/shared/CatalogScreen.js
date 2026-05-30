import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { getProducts } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProductCard from '../../components/ProductCard';
import CustomButton from '../../components/CustomButton';

/**
 * CatalogScreen: Muestra catálogo de productos
 * - Consume API con manejo de estados
 * - Usa AsyncStorage para cachear productos
 * - Componentes reutilizables
 */
export default function CatalogScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar del caché primero
      const cachedProducts = await AsyncStorage.getItem('products_catalog');
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }

      // Obtener datos frescos de la API
      const freshProducts = await getProducts();
      setProducts(freshProducts);

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('products_catalog', JSON.stringify(freshProducts));
      setLoading(false);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('No se pudieron cargar los productos');
      setLoading(false);

      // Usar caché si hay error
      try {
        const cachedProducts = await AsyncStorage.getItem('products_catalog');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setError('Mostrando datos en caché (modo offline)');
        }
      } catch (cacheErr) {
        console.error('Error leyendo caché:', cacheErr);
      }
    }
  };

  const handleProductPress = (product) => {
    console.log('Producto seleccionado:', product);
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛍️ Catálogo de Productos</Text>

      {error && <ErrorMessage message={error} />}

      <View style={styles.grid}>
        {products.map(item => (
          <ProductCard
            key={item.id}
            product={item}
            onPress={() => handleProductPress(item)}
          />
        ))}
      </View>

      {products.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        </View>
      )}

      <CustomButton
        title="Volver al Inicio (Demo terminada)"
        onPress={() => navigation.navigate('Login')}
        variant="primary"
        style={styles.btnEnd}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colour.background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colour.primary
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    justifyContent: 'center'
  },
  emptyText: {
    color: Colour.text,
    fontSize: 16,
    textAlign: 'center'
  },
  btnEnd: {
    marginVertical: 30
  }
});