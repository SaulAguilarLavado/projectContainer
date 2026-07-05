import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Colour from '../../constants/Colour';
import { getRepairs } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import logger from '../../utils/logger';

export default function MyRepairsScreen() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadRepairs();
    }, [])
  );

  const loadRepairs = async () => {
    setLoading(true);
    setError(null);
    try {
      const rawUser = await AsyncStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      if (!user?.id) throw new Error('No se encontró la sesión del cliente');

      const cacheKey = `customer_repairs_${user.id}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) setRepairs(JSON.parse(cached));

      const freshRepairs = await getRepairs(user.id);
      setRepairs(freshRepairs);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(freshRepairs));
    } catch (loadError) {
      logger.handled('customer_repairs_load_failed', loadError);
      setError(loadError.message || 'No se pudieron cargar las reparaciones.');
    } finally {
      setLoading(false);
    }
  };

  const statusView = status => {
    if (status === 'Completado') return { label: '✅ LISTO PARA RECOGER', color: Colour.success };
    if (status === 'En Proceso') return { label: '🧵 EN PROCESO', color: Colour.warning };
    return { label: '⏳ PENDIENTE', color: Colour.error };
  };

  if (loading && repairs.length === 0) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📦 Mis reparaciones</Text>
      <Text style={styles.subtitle}>Consulta el avance y la evidencia asociada a cada prenda.</Text>
      {!!error && <ErrorMessage message={error} />}
      {repairs.length === 0 ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyText}>Todavía no tienes reparaciones registradas.</Text></View>
      ) : (
        repairs.map(item => {
            const status = statusView(item.status);
            return (
              <View key={item.id} style={styles.statusCard}>
                {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.photo} />}
                <Text style={styles.itemTitle}>{item.item}</Text>
                <Text style={[styles.statusBadge, { color: status.color }]}>{status.label}</Text>
                {!!item.description && <Text style={styles.description}>{item.description}</Text>}
                <View style={styles.detailsBox}>
                  <Text style={styles.detail}>Entrega: {item.date}</Text>
                  <Text style={styles.detail}>Ubicación: {item.location}</Text>
                  <Text style={styles.detail}>Costo: S/ {Number(item.cost).toFixed(2)}</Text>
                </View>
              </View>
            );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colour.background },
  content: { padding: 20, paddingBottom: 34 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colour.primary },
  subtitle: { color: '#68727D', marginTop: 5, marginBottom: 18 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { color: Colour.text, fontSize: 16, textAlign: 'center' },
  statusCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  photo: { width: '100%', height: 180, borderRadius: 9, marginBottom: 12, backgroundColor: '#E8ECEF' },
  itemTitle: { fontSize: 18, fontWeight: '700', color: Colour.text, marginBottom: 7 },
  statusBadge: { fontWeight: 'bold', fontSize: 14, marginBottom: 10 },
  description: { color: '#58616A', lineHeight: 19, marginBottom: 12 },
  detailsBox: { borderTopWidth: 1, borderColor: '#EEE', paddingTop: 10 },
  detail: { color: '#666', fontSize: 13, marginBottom: 4 }
});
