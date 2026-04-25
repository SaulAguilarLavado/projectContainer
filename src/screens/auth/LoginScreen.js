import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colour from '../../constants/Colour';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TextilControl Login</Text>
      <TextInput placeholder="Usuario" style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} />
      
      <TouchableOpacity style={styles.btnMain}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.btnNext} 
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.btnNextText}>Siguiente: Registro (Demo) →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: Colour.background },
  title: { fontSize: 24, fontWeight: 'bold', color: Colour.primary, textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: Colour.white, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
  btnMain: { backgroundColor: Colour.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: Colour.white, fontWeight: 'bold' },
  btnNext: { marginTop: 30, padding: 10, borderWidth: 1, borderColor: Colour.secondary, borderRadius: 5 },
  btnNextText: { color: Colour.secondary, textAlign: 'center' }
});