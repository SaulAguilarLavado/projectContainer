import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { getUsuarios } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener usuarios del API
      const apiUsers = await getUsuarios();
      
      // Obtener usuarios registrados temporalmente
      const registeredUsersJson = await AsyncStorage.getItem('registeredUsers');
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];

      // Combinar ambas listas
      const allUsers = [...apiUsers, ...registeredUsers];
      
      setUsers(allUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('No se pudieron cargar los usuarios');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👥 Usuarios Registrados</Text>

      {error && <ErrorMessage message={error} />}

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay usuarios registrados</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.countText}>Total: {users.length} usuario(s)</Text>
          <FlatList
            scrollEnabled={false}
            data={users}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <View style={styles.userHeader}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{item.role}</Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>📧 {item.email}</Text>
                {item.created_at && (
                  <Text style={styles.userDate}>
                    📅 {new Date(item.created_at).toLocaleDateString('es-ES')}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
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
    marginBottom: 15
  },
  countText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontWeight: '600'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    color: Colour.text,
    fontSize: 16
  },
  userCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colour.text,
    flex: 1
  },
  roleBadge: {
    backgroundColor: Colour.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12
  },
  roleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6
  },
  userDate: {
    fontSize: 12,
    color: '#AAA'
  }
});
