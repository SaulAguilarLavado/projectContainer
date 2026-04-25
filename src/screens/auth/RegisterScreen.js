import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Colour from '../../constants/Colour';

export default function RegisterScreen({ navigation }) {
  // Estados para los campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para los mensajes de error (Excepciones)
  const [errors, setErrors] = useState({});

  const validateForm = () => {
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
      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate('PanelCosturera');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>

      {/* Input Nombre */}
      <Text style={styles.label}>Nombre Completo:</Text>
      <TextInput 
        style={[styles.input, errors.name && styles.inputError]} 
        onChangeText={setName}
        placeholder="Ej: Juan Perez"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Input Email */}
      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput 
        style={[styles.input, errors.email && styles.inputError]} 
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="usuario@correo.com"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Input Password */}
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput 
        style={[styles.input, errors.password && styles.inputError]} 
        secureTextEntry 
        onChangeText={setPassword}
        placeholder="Mínimo 6 caracteres"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity style={styles.btnMain} onPress={validateForm}>
        <Text style={styles.btnText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PanelCosturera')} style={styles.btnNext}>
        <Text style={styles.btnNextText}>Omitir para Demo (Siguiente) →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colour.background,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colour.primary,
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colour.text
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  inputError: {
    borderColor: Colour.error
  },
  errorText: {
    color: Colour.error,
    fontSize: 12,
    marginBottom: 15
  },
  btnMain: {
    backgroundColor: Colour.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  btnNext: {
    marginTop: 20,
    alignSelf: 'center'
  },
  btnNextText: {
    color: '#666'
  }
});