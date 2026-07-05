import React, { useCallback, useState } from 'react';
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Colour from '../../constants/Colour';
import { getRepairs, updateRepairStatus } from '../../services/api';
import { notifyRepairStatusChanged } from '../../services/notifications';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import logger from '../../utils/logger';

export default function AdminRepairsStatusScreen() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const statusOptions = ['Pendiente', 'En Proceso', 'Completado'];

  useFocusEffect(
    useCallback(() => {
      loadRepairs();
    }, [])
  );

  const loadRepairs = async () => {
    setLoading(true);
    setError(null);
    try {
      const cachedRepairs = await AsyncStorage.getItem('admin_repairs');
      if (cachedRepairs) setRepairs(JSON.parse(cachedRepairs));

      const freshRepairs = await getRepairs();
      setRepairs(freshRepairs);
      await AsyncStorage.setItem('admin_repairs', JSON.stringify(freshRepairs));
    } catch (loadError) {
      logger.handled('repairs_status_load_failed', loadError);
      const cachedRepairs = await AsyncStorage.getItem('admin_repairs');
      if (cachedRepairs) {
        setRepairs(JSON.parse(cachedRepairs));
        setError('Sin conexión: se muestran los últimos datos guardados.');
      } else {
        setError(loadError.message || 'No se pudieron cargar las reparaciones.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async newStatus => {
    if (!selectedRepair || updating) {
      setModalVisible(false);
      return;
    }
    if (newStatus === selectedRepair.status) {
      setModalVisible(false);
      setSelectedRepair(null);
      return;
    }

    setUpdating(true);
    try {
      const updatedRepair = await updateRepairStatus(selectedRepair.id, newStatus);
      const updatedRepairs = repairs.map(repair => repair.id === updatedRepair.id ? updatedRepair : repair);
      setRepairs(updatedRepairs);
      await AsyncStorage.setItem('admin_repairs', JSON.stringify(updatedRepairs));

      let notificationResult = { delivered: false };
      try {
        notificationResult = await notifyRepairStatusChanged(updatedRepair);
      } catch (notificationError) {
        logger.handled('status_notification_failed', notificationError, { repairId: updatedRepair.id });
      }

      setModalVisible(false);
      setSelectedRepair(null);
      const actions = [{ text: 'OK' }];
      if (!notificationResult.delivered && notificationResult.permission?.canAskAgain === false) {
        actions.push({ text: 'Abrir Ajustes', onPress: () => Linking.openSettings() });
      }
      Alert.alert(
        'Estado actualizado',
        notificationResult.delivered
          ? `${updatedRepair.item} cambió a “${newStatus}” y se generó una notificación.`
          : `${updatedRepair.item} cambió a “${newStatus}”. Las notificaciones están desactivadas.`,
        actions
      );
    } catch (updateError) {
      logger.handled('repair_status_update_failed', updateError, { repairId: selectedRepair.id });
      Alert.alert('No se actualizó el estado', updateError.message || 'Intenta nuevamente.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = status => {
    if (status === 'Completado') return Colour.success;
    if (status === 'En Proceso') return Colour.warning;
    if (status === 'Pendiente') return Colour.error;
    return '#95A5A6';
  };

  if (loading && repairs.length === 0) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🔧 Estado de reparaciones</Text>
      <Text style={styles.subtitle}>Toca una orden para actualizarla y generar el aviso correspondiente.</Text>
      {!!error && <ErrorMessage message={error} />}

      {repairs.length === 0 ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyText}>No hay reparaciones registradas</Text></View>
      ) : (
        repairs.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.repairCard}
              onPress={() => { setSelectedRepair(item); setModalVisible(true); }}
            >
              {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.photo} />}
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.item}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.cardDetail}>👤 {item.client}</Text>
              <Text style={styles.cardDetail}>📅 {item.date} · Almacén {item.location}</Text>
              <Text style={styles.tapHint}>Toca para cambiar el estado</Text>
            </TouchableOpacity>
        ))
      )}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar estado</Text>
            <Text style={styles.modalSubtitle}>{selectedRepair?.item}</Text>
            {statusOptions.map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.statusOption, selectedRepair?.status === status && styles.statusOptionActive]}
                onPress={() => handleStatusChange(status)}
                disabled={updating}
              >
                <Text style={[styles.statusOptionText, selectedRepair?.status === status && styles.statusOptionTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => { setModalVisible(false); setSelectedRepair(null); }}
              disabled={updating}
            >
              <Text style={styles.cancelButtonText}>{updating ? 'Actualizando...' : 'Cancelar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colour.background },
  content: { padding: 20, paddingBottom: 34 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colour.primary },
  subtitle: { color: '#68727D', lineHeight: 19, marginTop: 5, marginBottom: 18 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { color: Colour.text, fontSize: 16 },
  repairCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 3 },
  photo: { width: '100%', height: 150, borderRadius: 9, marginBottom: 12, backgroundColor: '#E8ECEF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colour.text, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  cardDetail: { fontSize: 13, color: '#666', marginBottom: 4 },
  tapHint: { fontSize: 11, color: '#7A838C', marginTop: 6, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 14, padding: 20, width: '84%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colour.primary, marginBottom: 5 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  statusOption: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10, backgroundColor: '#F0F0F0', borderWidth: 2, borderColor: 'transparent' },
  statusOptionActive: { backgroundColor: Colour.primary, borderColor: Colour.primary },
  statusOptionText: { fontSize: 14, color: '#333' },
  statusOptionTextActive: { color: '#FFF', fontWeight: 'bold' },
  cancelButton: { paddingVertical: 12, borderRadius: 8, marginTop: 8, backgroundColor: '#E0E0E0' },
  cancelButtonText: { textAlign: 'center', color: '#333', fontWeight: '600' }
});
