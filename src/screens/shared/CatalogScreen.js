import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { getProducts, buyProduct } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProductCard from '../../components/ProductCard';
import CustomButton from '../../components/CustomButton';
import logger from '../../utils/logger';

export default function CatalogScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedProducts = await AsyncStorage.getItem('products_catalog');
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }

      const freshProducts = await getProducts();
      setProducts(freshProducts);

      await AsyncStorage.setItem('products_catalog', JSON.stringify(freshProducts));
      setLoading(false);
    } catch (err) {
      logger.handled('products_load_failed', err);
      setError('No se pudieron cargar los productos');
      setLoading(false);

      try {
        const cachedProducts = await AsyncStorage.getItem('products_catalog');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setError('Mostrando datos en caché (modo offline)');
        }
      } catch (cacheErr) {
        logger.handled('products_cache_read_failed', cacheErr);
      }
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setQuantity('1');
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (!selectedProduct) return;

    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad válida');
      return;
    }
    if (qty > selectedProduct.stock) {
      Alert.alert('Stock insuficiente', `Solo hay ${selectedProduct.stock} unidades disponibles`);
      return;
    }

    const rawUser = await AsyncStorage.getItem('user');
    if (!rawUser) {
      Alert.alert('Error', 'Debes iniciar sesión para comprar');
      return;
    }

    const user = JSON.parse(rawUser);
    if (user.role !== 'cliente') {
      Alert.alert('Acceso denegado', 'Solo los clientes pueden comprar productos');
      return;
    }

    setBuying(true);
    try {
      const purchase = await buyProduct(selectedProduct.id, user.id, qty);
      Alert.alert(
        'Compra exitosa',
        `Compraste ${qty}x ${selectedProduct.name} por S/ ${purchase.total.toFixed(2)}`
      );
      setModalVisible(false);
      loadProducts();
    } catch (err) {
      Alert.alert('Error al comprar', err.message || 'No se pudo completar la compra');
    } finally {
      setBuying(false);
    }
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Catálogo de Productos</Text>

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
        title={loading ? 'Actualizando...' : 'Actualizar catálogo'}
        onPress={loadProducts}
        disabled={loading}
        variant="secondary"
        style={styles.btnEnd}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>
                  S/ {parseFloat(selectedProduct.price).toFixed(2)}
                </Text>
                <Text style={styles.modalStock}>Stock: {selectedProduct.stock}</Text>
                <Text style={styles.modalLabel}>Cantidad:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  editable={!buying}
                />
                <Text style={styles.modalTotal}>
                  Total: S/ {(parseInt(quantity || '0', 10) * parseFloat(selectedProduct.price)).toFixed(2)}
                </Text>
                <View style={styles.modalButtons}>
                  <CustomButton
                    title="Cancelar"
                    onPress={() => setModalVisible(false)}
                    disabled={buying}
                    variant="secondary"
                    style={styles.modalBtn}
                  />
                  <CustomButton
                    title={buying ? 'Comprando...' : 'Comprar'}
                    onPress={handleBuy}
                    disabled={buying || !quantity || parseInt(quantity, 10) < 1}
                    variant="primary"
                    style={styles.modalBtn}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colour.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colour.text,
    marginBottom: 5
  },
  modalPrice: {
    fontSize: 16,
    color: Colour.primary,
    fontWeight: '600',
    marginBottom: 5
  },
  modalStock: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15
  },
  modalLabel: {
    fontSize: 14,
    color: Colour.text,
    alignSelf: 'flex-start',
    marginBottom: 5
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  modalTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colour.primary,
    marginBottom: 15
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 5
  }
});
