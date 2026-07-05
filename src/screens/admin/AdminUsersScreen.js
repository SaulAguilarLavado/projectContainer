import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Colour from '../../constants/Colour';
import { getUsuarios } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import logger from '../../utils/logger';

const CACHE_KEY = 'users_cache';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(useCallback(() => { loadUsers(); }, []));

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) setUsers(JSON.parse(cached));
      const apiUsers = await getUsuarios();
      setUsers(apiUsers);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(apiUsers));
    } catch (loadError) {
      logger.handled('users_load_failed', loadError);
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setUsers(JSON.parse(cached));
        setError('Sin conexión: mostrando usuarios guardados.');
      } else {
        setError(loadError.message || 'No se pudieron cargar los usuarios.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>👥 Usuarios registrados</Text>
      {!!error && <ErrorMessage message={error} />}
      <Text style={styles.countText}>Total: {users.length}</Text>
      {users.length === 0 ? (
        <View style={styles.emptyContainer}><Text>No hay usuarios registrados</Text></View>
      ) : users.map(item => (
          <View key={item.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <Text style={styles.userName}>{item.name}</Text>
              <View style={styles.roleBadge}><Text style={styles.roleText}>{item.role}</Text></View>
            </View>
            <Text style={styles.userDetail}>@{item.username}</Text>
            <Text style={styles.userDetail}>✉️ {item.email}</Text>
          </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colour.background },
  content: { padding: 20, paddingBottom: 34 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colour.primary, marginBottom: 15 },
  countText: { color: '#666', marginBottom: 12, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  userCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  userName: { fontSize: 16, fontWeight: 'bold', color: Colour.text, flex: 1 },
  roleBadge: { backgroundColor: Colour.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  roleText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  userDetail: { fontSize: 13, color: '#666', marginBottom: 4 }
});
