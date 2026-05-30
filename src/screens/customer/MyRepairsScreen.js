import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { getRepairs } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import RepairCard from '../../components/RepairCard';

export default function MyRepairsScreen({ navigation }) {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar reparaciones del usuario
      const freshRepairs = await getRepairs();
      
      // Filtrar solo las que están listas o por recoger
      const userRepairs = freshRepairs.filter(repair => 
        repair.status === 'Completado' || repair.status === 'En Proceso'
      );
      
      setRepairs(userRepairs);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando reparaciones:', err);
      setError('No se pudieron cargar las reparaciones');
      setLoading(false);
    }
  };

  const getReparationStatus = (status) => {
    if (status === 'Completado') {
      return { label: '✅ LISTO PARA RECOGER', color: Colour.success };
    } else if (status === 'En Proceso') {
      return { label: '⏳ EN PROCESO', color: Colour.warning };
    }
    return { label: '⏳ PENDIENTE', color: '#FFA500' };
  };

  if (loading && repairs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📦 Mis Reparaciones</Text>

      {error && <ErrorMessage message={error} />}

      {repairs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay reparaciones en proceso</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={repairs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const status = getReparationStatus(item.status);
            return (
              <View style={styles.statusCard}>
                <Text style={styles.itemTitle}>{item.item}</Text>
                <Text style={[styles.statusBadge, { color: status.color }]}>
                  {status.label}
                </Text>
                <View style={styles.locationBox}>
                  <Text style={styles.locationLabel}>Cliente: {item.client}</Text>
                  <Text style={styles.locationLetter}>📍</Text>
                </View>
              </View>
            );
          }}
        />
      )}
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
    padding: 40,
    justifyContent: 'center'
  },
  emptyText: {
    color: Colour.text,
    fontSize: 16,
    textAlign: 'center'
  },
  statusCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colour.text,
    marginBottom: 8
  },
  statusBadge: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 12
  },
  locationBox: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EEE',
    paddingTop: 12
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  locationLetter: {
    fontSize: 24
  }
});