import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colour from '../../constants/Colour';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/api';
import logger from '../../utils/logger';

const CACHE_KEY = 'products_catalog';
const EMPTY_FORM = { name: '', price: '', stock: '', description: '' };

export default function AdminProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  useFocusEffect(useCallback(() => { loadProducts(); }, []));

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) setProducts(JSON.parse(cached));
      const freshProducts = await getProducts();
      setProducts(freshProducts);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(freshProducts));
    } catch (loadError) {
      logger.handled('admin_products_load_failed', loadError);
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setProducts(JSON.parse(cached));
        setError('Sin conexión: mostrando el catálogo guardado.');
      } else {
        setError(loadError.message || 'No se pudo cargar el catálogo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
    setFormErrors(current => ({ ...current, [field]: null }));
  };

  const openCamera = async () => {
    try {
      let permission = cameraPermission;
      if (!permission?.granted && permission?.canAskAgain !== false) {
        permission = await requestCameraPermission();
      }
      if (permission?.granted) {
        setCameraReady(false);
        setCameraVisible(true);
        return;
      }
      const actions = [{ text: 'Cancelar', style: 'cancel' }];
      if (permission?.canAskAgain === false) {
        actions.push({ text: 'Abrir Ajustes', onPress: () => Linking.openSettings() });
      } else {
        actions.push({ text: 'Volver a intentar', onPress: openCamera });
      }
      Alert.alert('Permiso de cámara requerido', 'Toma una foto del producto.', actions);
    } catch (error) {
      logger.handled('product_camera_permission_failed', error);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady || takingPhoto) return;
    setTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setCameraVisible(false);
      }
    } catch (error) {
      logger.handled('product_camera_capture_failed', error);
      Alert.alert('No se tomó la foto', 'Intenta nuevamente.');
    } finally {
      setTakingPhoto(false);
    }
  };

  const openCreate = () => {
    setSelectedProduct(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setPhotoUri(null);
    setModalVisible(true);
  };

  const openEdit = product => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || ''
    });
    setFormErrors({});
    setPhotoUri(null);
    setModalVisible(true);
  };

  const validate = () => {
    const nextErrors = {};
    const price = Number(form.price.replace(',', '.'));
    const stock = Number(form.stock);
    if (form.name.trim().length < 2) nextErrors.name = 'Ingresa un nombre válido';
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = 'El precio debe ser mayor que cero';
    if (!Number.isInteger(stock) || stock < 0) nextErrors.stock = 'El stock debe ser un entero igual o mayor que cero';
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveProduct = async () => {
    if (!validate() || saving) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price.replace(',', '.')),
        stock: Number(form.stock),
        photoUri
      };
      const saved = selectedProduct
        ? await updateProduct(selectedProduct.id, payload)
        : await createProduct(payload);
      const updatedProducts = selectedProduct
        ? products.map(product => product.id === saved.id ? saved : product)
        : [...products, saved].sort((a, b) => a.name.localeCompare(b.name));
      setProducts(updatedProducts);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedProducts));
      setModalVisible(false);
      Alert.alert('Producto guardado', `${saved.name} se guardó correctamente.`);
    } catch (saveError) {
      logger.handled('product_save_failed', saveError);
      Alert.alert('No se pudo guardar', saveError.message || 'Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = product => {
    Alert.alert('Eliminar producto', `¿Deseas eliminar “${product.name}”?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(product.id);
            const updatedProducts = products.filter(item => item.id !== product.id);
            setProducts(updatedProducts);
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedProducts));
          } catch (deleteError) {
            logger.handled('product_delete_failed', deleteError);
            Alert.alert('No se pudo eliminar', deleteError.message || 'Intenta nuevamente.');
          }
        }
      }
    ]);
  };

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.title}>📦 Productos</Text>
          <Text style={styles.subtitle}>Administra precios, stock y descripción.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openCreate}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      {!!error && <ErrorMessage message={error} />}

      {products.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>No hay productos registrados.</Text></View>
      ) : products.map(product => (
        <View key={product.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.price}>S/ {Number(product.price).toFixed(2)}</Text>
          </View>
          <Text style={[styles.stock, { color: product.stock > 0 ? Colour.success : Colour.error }]}>Stock: {product.stock}</Text>
          {!!product.description && <Text style={styles.description}>{product.description}</Text>}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={() => openEdit(product)}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(product)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <CustomButton title={loading ? 'Actualizando...' : 'Actualizar catálogo'} onPress={loadProducts} disabled={loading} variant="secondary" />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              <Text style={styles.modalTitle}>{selectedProduct ? 'Editar producto' : 'Nuevo producto'}</Text>
              <CustomInput label="Nombre" value={form.name} onChangeText={value => updateField('name', value)} error={formErrors.name} />
              <CustomInput label="Precio (S/)" value={form.price} onChangeText={value => updateField('price', value)} keyboardType="decimal-pad" error={formErrors.price} />
              <CustomInput label="Stock" value={form.stock} onChangeText={value => updateField('stock', value)} keyboardType="number-pad" error={formErrors.stock} />
              <CustomInput label="Descripción" value={form.description} onChangeText={value => updateField('description', value)} multiline maxLength={500} />
              <Text style={styles.photoLabel}>Foto del producto</Text>
              {photoUri || selectedProduct?.photoUrl ? (
                <Image source={{ uri: photoUri || selectedProduct.photoUrl }} style={styles.photoPreview} resizeMode="cover" />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>Sin foto</Text>
                </View>
              )}
              <CustomButton title={photoUri || selectedProduct?.photoUrl ? 'Volver a tomar foto' : 'Tomar foto'} onPress={openCamera} variant="secondary" />
              <CustomButton title={saving ? 'Guardando...' : 'Guardar producto'} onPress={saveProduct} disabled={saving} />
              <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} disabled={saving} variant="secondary" />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={cameraVisible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setCameraVisible(false)}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            mode="picture"
            onCameraReady={() => setCameraReady(true)}
            onMountError={() => {
              setCameraVisible(false);
              Alert.alert('Cámara no disponible', 'No se pudo iniciar la cámara.');
            }}
          />
          <View style={styles.cameraHeader}>
            <TouchableOpacity style={styles.closeCamera} onPress={() => setCameraVisible(false)}>
              <Text style={styles.cameraActionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cameraFooter}>
            <Text style={styles.cameraHint}>{cameraReady ? 'Toma la foto del producto' : 'Preparando cámara...'}</Text>
            <TouchableOpacity
              style={[styles.shutter, (!cameraReady || takingPhoto) && styles.shutterDisabled]}
              onPress={takePhoto}
              disabled={!cameraReady || takingPhoto}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colour.background },
  content: { padding: 18, paddingBottom: 36 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  titleCopy: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colour.primary },
  subtitle: { color: '#69737D', marginTop: 3 },
  addButton: { backgroundColor: Colour.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9 },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
  empty: { padding: 36, alignItems: 'center' },
  emptyText: { color: '#666' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { flex: 1, fontSize: 16, fontWeight: 'bold', color: Colour.text, marginRight: 10 },
  price: { color: Colour.primary, fontWeight: 'bold' },
  stock: { fontWeight: '700', marginTop: 8 },
  description: { color: '#606A73', marginTop: 7, lineHeight: 19 },
  actions: { flexDirection: 'row', marginTop: 14, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 11 },
  editButton: { flex: 1, padding: 9, backgroundColor: '#E8F0F8', borderRadius: 7, marginRight: 7 },
  editText: { textAlign: 'center', color: Colour.primary, fontWeight: '700' },
  deleteButton: { flex: 1, padding: 9, backgroundColor: '#FDECEC', borderRadius: 7, marginLeft: 7 },
  deleteText: { textAlign: 'center', color: Colour.error, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#FFF', borderRadius: 14, maxHeight: '88%', width: '100%' },
  modalScrollContent: { padding: 20, paddingBottom: 28 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colour.primary, marginBottom: 16 },
  photoLabel: { fontWeight: 'bold', color: Colour.text, fontSize: 14, marginBottom: 8, marginTop: 8 },
  photoPreview: { width: '100%', height: 150, borderRadius: 10, backgroundColor: '#E6E9EC', marginBottom: 10 },
  photoPlaceholder: { height: 80, borderRadius: 10, backgroundColor: '#EDF1F4', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  photoPlaceholderText: { color: '#6D7780' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraHeader: { position: 'absolute', top: 50, left: 20 },
  closeCamera: { backgroundColor: 'rgba(0,0,0,0.65)', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  cameraActionText: { color: '#FFF', fontWeight: 'bold' },
  cameraFooter: { position: 'absolute', bottom: 38, left: 0, right: 0, alignItems: 'center' },
  cameraHint: { color: '#FFF', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 18 },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 5, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFF' },
  shutterDisabled: { opacity: 0.5 }
});
