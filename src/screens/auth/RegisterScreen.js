import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colour from '../../constants/Colour';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.includes('@')) setError('El correo debe incluir @');
    else setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>
      <TextInput placeholder="Nombre Completo" style={styles.input} />
      <TextInput 
        placeholder="Correo Electrónico" 
        style={styles.input} 
        onChangeText={setEmail}
        onBlur={validate}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.btnMain}>
        <Text style={styles.btnText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PanelCosturera')} style={styles.btnNext}>
        <Text style={styles.btnNextText}>Siguiente: Panel Costurera →</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20
  },
  input: {
    backgroundColor: Colour.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  errorText: {
    color: Colour.error,
    marginBottom: 10,
    fontSize: 12
  },
  btnMain: {
    backgroundColor: Colour.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnText: {
    color: Colour.white
  },
  btnNext: {
    marginTop: 20,
    alignSelf: 'center'
  },
  btnNextText: {
    color: Colour.primary,
    fontWeight: '600'
  }
});