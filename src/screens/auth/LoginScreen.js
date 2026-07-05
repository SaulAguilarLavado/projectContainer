import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { loginUsuario } from '../../services/api';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import logger from '../../utils/logger';
import { StyleSheet, Text } from 'react-native';

/**
 * LoginScreen: Pantalla de autenticación
 * - Valida credenciales contra el backend FastAPI
 * - Guarda datos del usuario en AsyncStorage
 * - Maneja estados de carga y error
 */
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginUsuario(username, password);

      // Guardar datos del usuario en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.usuario));
      await AsyncStorage.setItem('token', response.token || '');

      // Navegar según el rol
      if (response.usuario.role === 'admin') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminApp' }]
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'CustomerApp' }]
        });
      }

      setUsername('');
      setPassword('');
    } catch (err) {
      logger.handled('login_failed', err);
      setError(err.message || 'Error al iniciar sesión');
      
      Alert.alert(
        'Error de Login',
        err.message || 'Verifique sus credenciales'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>🧵 TextilControl</Text>
        <Text style={styles.subtitle}>Sistema de Gestión Textil</Text>

        {error && <ErrorMessage message={error} />}

        <CustomInput
          label="Usuario"
          placeholder="admin"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
          editable={!loading}
        />

        <CustomInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          error={errors.password}
          editable={!loading}
        />

        <CustomButton
          title="Entrar"
          onPress={handleLogin}
          disabled={loading}
          variant="primary"
          style={styles.btnMain}
        />

        <CustomButton
          title="¿No tienes cuenta? Regístrate aquí →"
          onPress={() => navigation.navigate('Registro')}
          disabled={loading}
          variant="secondary"
          style={styles.btnNext}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>👤 Credenciales de Prueba</Text>
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Admin:</Text>
            <Text style={styles.credentialValue}>admin</Text>
            <Text style={styles.credentialSeparator}>/</Text>
            <Text style={styles.credentialValue}>admin123</Text>
          </View>
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Cliente:</Text>
            <Text style={styles.credentialValue}>cliente1</Text>
            <Text style={styles.credentialSeparator}>/</Text>
            <Text style={styles.credentialValue}>cliente123</Text>
          </View>
          <Text style={styles.infoHint}>O usa tu cuenta registrada</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colour.background
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colour.primary,
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: Colour.text,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7
  },
  btnMain: {
    marginTop: 20
  },
  btnNext: {
    marginTop: 15
  },
  infoBox: {
    marginTop: 40,
    padding: 15,
    backgroundColor: Colour.white,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colour.secondary
  },
  infoTitle: {
    fontWeight: 'bold',
    color: Colour.primary,
    marginBottom: 10,
    fontSize: 14
  },
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  credentialLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginRight: 8
  },
  credentialValue: {
    fontSize: 11,
    color: Colour.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  credentialSeparator: {
    fontSize: 11,
    color: '#AAA',
    marginHorizontal: 6
  },
  infoHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic'
  }
});
