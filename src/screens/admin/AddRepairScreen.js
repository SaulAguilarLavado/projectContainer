import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colour from '../../constants/Colour';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ErrorMessage from '../../components/ErrorMessage';
import { createRepair, getUsuarios } from '../../services/api';
import { notifyRepairCreated } from '../../services/notifications';
import logger from '../../utils/logger';

const CLIENTS_CACHE_KEY = 'clients_cache';

export default function AddRepairScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [prenda, setPrenda] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [screenError, setScreenError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoadingClients(true);
    setScreenError('');
    try {
      const users = await getUsuarios();
      const customerUsers = users.filter(user => user.role === 'cliente' || user.role === 'customer');
      setClients(customerUsers);
      setClientId(current => current || customerUsers[0]?.id || null);
      await AsyncStorage.setItem(CLIENTS_CACHE_KEY, JSON.stringify(customerUsers));
    } catch (error) {
      logger.handled('clients_load_failed', error);
      const cached = await AsyncStorage.getItem(CLIENTS_CACHE_KEY);
      if (cached) {
        const cachedClients = JSON.parse(cached);
        setClients(cachedClients);
        setClientId(current => current || cachedClients[0]?.id || null);
        setScreenError('Sin conexión: se muestran los clientes guardados en caché.');
      } else {
        setScreenError(error.message || 'No se pudieron cargar los clientes.');
      }
    } finally {
      setLoadingClients(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const numericCost = Number(costo.replace(',', '.'));
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const [year, month, day] = fechaEntrega.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    const validDate = isoDatePattern.test(fechaEntrega)
      && parsedDate.getFullYear() === year
      && parsedDate.getMonth() === month - 1
      && parsedDate.getDate() === day;

    if (!clientId) newErrors.client = 'Selecciona un cliente';
    if (prenda.trim().length < 2) newErrors.prenda = 'Describe la prenda';
    if (!Number.isFinite(numericCost) || numericCost <= 0) newErrors.costo = 'Ingresa un costo mayor que cero';
    if (!validDate) {
      newErrors.fechaEntrega = 'Usa una fecha válida con formato AAAA-MM-DD';
    }
    if (!/^[A-Za-z]{1,3}$/.test(ubicacion.trim())) newErrors.ubicacion = 'Usa de 1 a 3 letras (por ejemplo, A o B12 no es válido)';
    if (!photoUri) newErrors.photo = 'Toma una foto como evidencia del estado de la prenda';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCamera = async () => {
    setErrors(current => ({ ...current, photo: null }));
    try {
      let permission = cameraPermission;
      if (!permission?.granted && permission?.canAskAgain !== false) {
        permission = await requestCameraPermission();
      }

      if (permission?.granted) {
        setCameraReady(false);
        setCameraVisible(true);
        logger.info('camera_opened');
        return;
      }

      const actions = [{ text: 'Cancelar', style: 'cancel' }];
      if (permission?.canAskAgain === false) {
        actions.push({ text: 'Abrir Ajustes', onPress: () => Linking.openSettings() });
      } else {
        actions.push({ text: 'Volver a intentar', onPress: openCamera });
      }
      Alert.alert(
        'Permiso de cámara requerido',
        'La fotografía documenta el estado en que se recibió la prenda. Puedes habilitar la cámara para continuar.',
        actions
      );
      logger.warn('camera_permission_denied', { canAskAgain: permission?.canAskAgain });
    } catch (error) {
      logger.handled('camera_permission_failed', error);
      Alert.alert('Cámara no disponible', 'No se pudo consultar el permiso de cámara. Intenta nuevamente.');
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady || takingPhoto) return;
    setTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!photo?.uri) throw new Error('La cámara no devolvió una imagen');
      setPhotoUri(photo.uri);
      setCameraVisible(false);
      logger.info('repair_photo_captured', { width: photo.width, height: photo.height });
    } catch (error) {
      logger.handled('camera_capture_failed', error);
      Alert.alert('No se tomó la foto', 'Mantén la aplicación abierta e intenta nuevamente.');
    } finally {
      setTakingPhoto(false);
    }
  };

  const resetForm = () => {
    setPrenda('');
    setDescripcion('');
    setCosto('');
    setFechaEntrega('');
    setUbicacion('');
    setPhotoUri(null);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setScreenError('');
    try {
      const repair = await createRepair({
        clientId,
        item: prenda,
        description: descripcion,
        deliveryDate: fechaEntrega,
        cost: Number(costo.replace(',', '.')),
        location: ubicacion,
        photoUri
      });

      let notificationResult;
      try {
        notificationResult = await notifyRepairCreated(repair);
      } catch (notificationError) {
        logger.handled('repair_notification_failed', notificationError, { repairId: repair.id });
        notificationResult = { delivered: false };
      }

      await AsyncStorage.removeItem('admin_repairs');
      resetForm();

      const message = notificationResult.delivered
        ? 'La reparación, su fotografía y la notificación se registraron correctamente.'
        : 'La reparación y su fotografía se guardaron. Las notificaciones están desactivadas; puedes habilitarlas en Ajustes.';
      const actions = [{ text: 'Ver reparaciones', onPress: () => navigation.goBack() }];
      if (!notificationResult.delivered && notificationResult.permission?.canAskAgain === false) {
        actions.push({
          text: 'Abrir Ajustes',
          onPress: () => {
            Linking.openSettings();
            navigation.goBack();
          }
        });
      }
      Alert.alert('Reparación registrada', message, actions);
    } catch (error) {
      logger.handled('repair_create_failed', error);
      setScreenError(error.message || 'No se pudo registrar la reparación.');
      Alert.alert('No se pudo guardar', error.message || 'Revisa los datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>Registra la orden y fotografía el estado inicial de la prenda.</Text>
      {!!screenError && <ErrorMessage message={screenError} />}

      <Text style={styles.label}>Cliente</Text>
      {loadingClients ? (
        <Text style={styles.helper}>Cargando clientes...</Text>
      ) : clients.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientList}>
          {clients.map(client => (
            <TouchableOpacity
              key={client.id}
              style={[styles.clientChip, clientId === client.id && styles.clientChipSelected]}
              onPress={() => setClientId(client.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: clientId === client.id }}
            >
              <Text style={[styles.clientText, clientId === client.id && styles.clientTextSelected]}>{client.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <CustomButton title="Reintentar carga de clientes" onPress={loadClients} variant="secondary" />
      )}
      {!!errors.client && <Text style={styles.validationText}>{errors.client}</Text>}

      <CustomInput label="Prenda" placeholder="Ej.: pantalón jean" value={prenda} onChangeText={setPrenda} error={errors.prenda} />
      <CustomInput
        label="Descripción del arreglo"
        placeholder="Ej.: reparar rotura en la rodilla"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        maxLength={500}
      />
      <CustomInput
        label="Costo (S/)"
        placeholder="50.00"
        value={costo}
        onChangeText={setCosto}
        keyboardType="decimal-pad"
        error={errors.costo}
      />
      <CustomInput
        label="Fecha de entrega"
        placeholder="2026-07-15"
        value={fechaEntrega}
        onChangeText={setFechaEntrega}
        error={errors.fechaEntrega}
        maxLength={10}
      />
      <CustomInput
        label="Ubicación en almacén (1-3 letras)"
        placeholder="A"
        value={ubicacion}
        onChangeText={text => setUbicacion(text.toUpperCase())}
        error={errors.ubicacion}
        autoCapitalize="characters"
        maxLength={3}
      />

      <View style={[styles.evidenceCard, errors.photo && styles.evidenceError]}>
        <Text style={styles.evidenceTitle}>📷 Evidencia fotográfica</Text>
        <Text style={styles.evidenceHint}>La foto quedará vinculada a esta reparación.</Text>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewIcon}>🧥</Text>
            <Text style={styles.emptyPreviewText}>Aún no hay evidencia</Text>
          </View>
        )}
        <CustomButton title={photoUri ? 'Volver a tomar foto' : 'Abrir cámara'} onPress={openCamera} variant="secondary" />
        {!!errors.photo && <Text style={styles.validationText}>{errors.photo}</Text>}
      </View>

      <CustomButton title={loading ? 'Guardando...' : 'Guardar y notificar'} onPress={handleSave} disabled={loading || loadingClients} />

      <Modal visible={cameraVisible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setCameraVisible(false)}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            mode="picture"
            onCameraReady={() => setCameraReady(true)}
            onMountError={event => {
              logger.handled('camera_mount_failed', new Error(event.message));
              setCameraVisible(false);
              Alert.alert('Cámara no disponible', event.message || 'No se pudo iniciar la cámara.');
            }}
          />
          <View style={styles.cameraHeader}>
            <TouchableOpacity style={styles.closeCamera} onPress={() => setCameraVisible(false)}>
              <Text style={styles.cameraActionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cameraFooter}>
            <Text style={styles.cameraHint}>{cameraReady ? 'Centra la prenda y toma la foto' : 'Preparando cámara...'}</Text>
            <TouchableOpacity
              style={[styles.shutter, (!cameraReady || takingPhoto) && styles.shutterDisabled]}
              onPress={takePhoto}
              disabled={!cameraReady || takingPhoto}
              accessibilityLabel="Tomar fotografía"
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
  content: { padding: 20, paddingBottom: 36 },
  intro: { color: '#5F6872', lineHeight: 20, marginBottom: 18 },
  label: { fontWeight: 'bold', color: Colour.text, fontSize: 14, marginBottom: 8 },
  helper: { color: '#666', marginBottom: 18 },
  clientList: { marginBottom: 16 },
  clientChip: { borderWidth: 1, borderColor: '#C9D1D9', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, marginRight: 8 },
  clientChipSelected: { backgroundColor: Colour.primary, borderColor: Colour.primary },
  clientText: { color: Colour.text, fontWeight: '600' },
  clientTextSelected: { color: Colour.white },
  validationText: { color: Colour.error, fontSize: 12, marginTop: 5 },
  evidenceCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#D9E0E7', marginBottom: 16 },
  evidenceError: { borderColor: Colour.error, borderWidth: 2 },
  evidenceTitle: { color: Colour.primary, fontWeight: 'bold', fontSize: 16 },
  evidenceHint: { color: '#69737D', fontSize: 12, marginTop: 4, marginBottom: 12 },
  preview: { width: '100%', height: 210, borderRadius: 10, backgroundColor: '#E6E9EC' },
  emptyPreview: { height: 145, borderRadius: 10, backgroundColor: '#EDF1F4', alignItems: 'center', justifyContent: 'center' },
  emptyPreviewIcon: { fontSize: 38 },
  emptyPreviewText: { color: '#6D7780', marginTop: 6 },
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
