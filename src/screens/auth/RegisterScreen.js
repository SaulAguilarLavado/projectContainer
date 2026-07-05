import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Colour from '../../constants/Colour';
import { registerUsuario } from '../../services/api';
import logger from '../../utils/logger';

export default function RegisterScreen({ navigation }) {
  // Estados para los campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Estados para los mensajes de error (Excepciones)
  const [errors, setErrors] = useState({});

  const validateForm = async () => {
    let tempErrors = {};
    
    // 1. Excepción: Campo de nombre vacío
    if (!name.trim()) tempErrors.name = "El nombre es obligatorio";

    // 2. Excepción: Formato de correo (Falta @ o punto)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) tempErrors.email = "Ingrese un correo válido (ej: usuario@correo.com)";

    // 3. Excepción: Contraseña muy corta
    if (password.length < 6) tempErrors.password = "La contraseña debe tener al menos 6 caracteres";

    setErrors(tempErrors);

    // Si no hay errores (el objeto está vacío), procedemos
    if (Object.keys(tempErrors).length === 0) {
      setLoading(true);
      setServerError('');
      try {
        await registerUsuario({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        });

        Alert.alert("Éxito", "Usuario registrado correctamente");
        
        // Limpiar campos
        setName('');
        setEmail('');
        setPassword('');
        setErrors({});
        
        // Navegar a login
        navigation.navigate('Login');
      } catch (err) {
        const message = err.message || 'No se pudo registrar el usuario';
        setServerError(message);
        Alert.alert("No se pudo registrar", message);
        logger.handled('register_failed', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>📝 Crear Cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para usar la aplicación</Text>
        {!!serverError && <Text style={styles.serverError}>{serverError}</Text>}

        {/* Input Nombre */}
        <Text style={styles.label}>Nombre Completo:</Text>
        <TextInput 
          style={[styles.input, errors.name && styles.inputError]} 
          onChangeText={setName}
          value={name}
          placeholder="Ej: Juan Perez"
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Input Email */}
        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput 
          style={[styles.input, errors.email && styles.inputError]} 
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          placeholder="usuario@correo.com"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Input Password */}
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput 
          style={[styles.input, errors.password && styles.inputError]} 
          secureTextEntry 
          onChangeText={setPassword}
          value={password}
          placeholder="Mínimo 6 caracteres"
          autoCapitalize="none"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity style={[styles.btnMain, loading && styles.disabled]} onPress={validateForm} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colour.primary,
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: Colour.text,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colour.text,
    fontSize: 14
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    color: Colour.text,
    fontSize: 14
  },
  inputError: {
    borderColor: Colour.error,
    borderWidth: 2
  },
  errorText: {
    color: Colour.error,
    fontSize: 12,
    marginBottom: 15
  },
  serverError: {
    color: Colour.white,
    backgroundColor: Colour.error,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center'
  },
  btnMain: {
    backgroundColor: Colour.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  btnSecondary: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center'
  },
  btnSecondaryText: {
    color: Colour.secondary,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.55
  }
});
