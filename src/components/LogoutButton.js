import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

export default function LogoutButton({ navigation }) {
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'token', 'selectedRepair']);
      let rootNavigation = navigation;
      while (rootNavigation.getParent()) rootNavigation = rootNavigation.getParent();
      rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      logger.info('session_closed');
    } catch (error) {
      logger.handled('logout_failed', error);
      Alert.alert('No se pudo cerrar sesión', 'Intenta nuevamente.');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Deseas salir de TextilControl?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <TouchableOpacity onPress={confirmLogout} style={styles.button} accessibilityRole="button">
      <Text style={styles.text}>Salir</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 12, paddingVertical: 7, marginRight: 4 },
  text: { color: '#FFF', fontWeight: '700', fontSize: 13 }
});
