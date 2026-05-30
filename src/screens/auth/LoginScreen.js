import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import { loginUsuario } from '../../services/api';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
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
      // Llamar al endpoint de login del backend
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
      console.error('Error en login:', err);
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
          <Text style={styles.infoTitle}>👤 Usuarios de Prueba</Text>
          <Text style={styles.infoText}>Admin: admin / admin123</Text>
          <Text style={styles.infoText}>Cliente: cliente1 / cliente123</Text>
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
    marginBottom: 8,
    fontSize: 14
  },
  infoText: {
    color: Colour.text,
    fontSize: 12,
    marginBottom: 4
  }
});