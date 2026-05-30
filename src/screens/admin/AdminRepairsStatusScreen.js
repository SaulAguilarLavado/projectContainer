import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { getRepairs } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminRepairsStatusScreen() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  const statusOptions = ['Pendiente', 'En Proceso', 'Completado'];

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar reparaciones del caché o API
      const cachedRepairs = await AsyncStorage.getItem('admin_repairs');
      if (cachedRepairs) {
        setRepairs(JSON.parse(cachedRepairs));
      }

      // Intentar obtener datos frescos
      const freshRepairs = await getRepairs();
      setRepairs(freshRepairs);
      await AsyncStorage.setItem('admin_repairs', JSON.stringify(freshRepairs));
      
      setLoading(false);
    } catch (err) {
      console.error('Error cargando reparaciones:', err);
      setError('No se pudieron cargar las reparaciones');
      setLoading(false);

      // Usar caché si hay error
      try {
        const cachedRepairs = await AsyncStorage.getItem('admin_repairs');
        if (cachedRepairs) {
          setRepairs(JSON.parse(cachedRepairs));
        }
      } catch (cacheErr) {
        console.error('Error leyendo caché:', cacheErr);
      }
    }
  };

  const handleStatusChange = (newStatus) => {
    if (selectedRepair) {
      const updatedRepairs = repairs.map(repair =>
        repair.id === selectedRepair.id
          ? { ...repair, status: newStatus }
          : repair
      );
      setRepairs(updatedRepairs);
      setModalVisible(false);
      setSelectedRepair(null);
      
      // Guardar cambios en AsyncStorage
      AsyncStorage.setItem('admin_repairs', JSON.stringify(updatedRepairs));
      
      Alert.alert('Éxito', `Estado actualizado a: ${newStatus}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return Colour.success;
      case 'En Proceso':
        return '#FFA500';
      case 'Pendiente':
        return '#E74C3C';
      default:
        return '#95A5A6';
    }
  };

  if (loading && repairs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 Estado de Reparaciones</Text>

      {error && <ErrorMessage message={error} />}

      {repairs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay reparaciones registradas</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={repairs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.repairCard}
              onPress={() => {
                setSelectedRepair(item);
                setModalVisible(true);
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.item}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) }
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.cardDetail}>👤 {item.client}</Text>
              <Text style={styles.cardDetail}>📅 {item.date}</Text>
              <Text style={styles.tapHint}>Toca para cambiar estado</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal para cambiar estado */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Estado</Text>
            {selectedRepair && (
              <Text style={styles.modalSubtitle}>{selectedRepair.item}</Text>
            )}

            {statusOptions.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  selectedRepair?.status === status && styles.statusOptionActive
                ]}
                onPress={() => handleStatusChange(status)}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    selectedRepair?.status === status && styles.statusOptionTextActive
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedRepair(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colour.background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colour.primary,
    marginBottom: 20
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    color: Colour.text,
    fontSize: 16
  },
  repairCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colour.text,
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  cardDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  tapHint: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 6,
    fontStyle: 'italic'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colour.primary,
    marginBottom: 5
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  statusOptionActive: {
    backgroundColor: Colour.primary,
    borderColor: Colour.primary
  },
  statusOptionText: {
    fontSize: 14,
    color: '#333'
  },
  statusOptionTextActive: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
    backgroundColor: '#E0E0E0'
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600'
  }
});
