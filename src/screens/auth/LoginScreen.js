import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colour from '../../constants/Colour';

export default function LoginScreen({ navigation }) {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');


  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      setError('Debes ingresar el usuario y la contraseña');
    } else {
      setError(''); 
      navigation.navigate('PanelCosturera'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TextilControl Login</Text>

      <TextInput 
        placeholder="Nombre de usuario" 
        style={[styles.input, error && username === '' ? styles.inputError : null]} 
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (text !== '') setError(''); 
        }}
      />

      
      <TextInput 
        placeholder="Contraseña" 
        secureTextEntry 
        style={[styles.input, error && password === '' ? styles.inputError : null]} 
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (text !== '') setError(''); 
        }}
      />

      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.btnMain} onPress={handleLogin}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.btnNext} 
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.btnNextText}>¿No tienes cuenta? Regístrate aquí →</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colour.primary,
    textAlign: 'center',
    marginBottom: 40
  },
  input: {
    backgroundColor: Colour.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  inputError: {
    borderColor: Colour.error,
  },
  errorText: {
    color: Colour.error,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500'
  },
  btnMain: {
    backgroundColor: Colour.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  btnText: {
    color: Colour.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  btnNext: {
    marginTop: 30,
    padding: 10,
  },
  btnNextText: {
    color: Colour.secondary,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});