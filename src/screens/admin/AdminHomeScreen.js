import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { getRepairs } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import RepairCard from '../../components/RepairCard';
import CustomButton from '../../components/CustomButton';

/**
 * AdminHomeScreen: Pantalla del administrador que muestra trabajos del día
 * - Consume API con useFetch + AsyncStorage
 * - Maneja estados de carga, error y datos
 * - Usa componentes reutilizables RepairCard y CustomButton
 */
export default function AdminHomeScreen({ navigation }) {
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

      // Intentar cargar del caché local primero (AsyncStorage)
      const cachedRepairs = await AsyncStorage.getItem('admin_repairs');
      if (cachedRepairs) {
        setRepairs(JSON.parse(cachedRepairs));
      }

      // Luego intentar obtener datos frescos de la API
      const freshRepairs = await getRepairs();
      setRepairs(freshRepairs);

      // Guardar en AsyncStorage para uso posterior offline
      await AsyncStorage.setItem('admin_repairs', JSON.stringify(freshRepairs));
      setLoading(false);
    } catch (err) {
      console.error('Error cargando reparaciones:', err);
      setError('No se pudieron cargar las reparaciones');
      setLoading(false);

      // Intentar usar caché si hay error
      try {
        const cachedRepairs = await AsyncStorage.getItem('admin_repairs');
        if (cachedRepairs) {
          setRepairs(JSON.parse(cachedRepairs));
          setError('Mostrando datos en caché (modo offline)');
        }
      } catch (cacheErr) {
        console.error('Error leyendo caché:', cacheErr);
      }
    }
  };

  const handleRepairPress = async (repair) => {
    // Guardar reparación seleccionada en AsyncStorage
    await AsyncStorage.setItem('selectedRepair', JSON.stringify(repair));
    console.log('Reparación seleccionada:', repair);
  };

  if (loading && repairs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 Trabajos del Día</Text>

      {error && <ErrorMessage message={error} />}

      {repairs.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay reparaciones pendientes</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={repairs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RepairCard
              item={item}
              onPress={() => handleRepairPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Cargando reparaciones...</Text>
            </View>
          }
        />
      )}

      <CustomButton
        title="+ Nueva Reparación"
        onPress={() => navigation.navigate('NuevaReparacion')}
        variant="primary"
        style={styles.btnAdd}
      />
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
  btnAdd: {
    marginBottom: 10
  },
  btnNext: {
    marginBottom: 30
  }
});