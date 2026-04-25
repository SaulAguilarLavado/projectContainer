import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colour from '../../constants/Colour';

export default function AddRepairScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Orden de Trabajo</Text>
      <TextInput placeholder="Prenda (ej: Pantalón Jean)" style={styles.input} />
      <TextInput placeholder="Costo S/." keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Fecha Entrega (dd/mm/yyyy)" style={styles.input} />

      <View style={styles.warehouseBox}>
        <Text style={styles.label}>Ubicación en Almacén (Hueco):</Text>
        <TextInput placeholder="A-Z" maxLength={1} style={[styles.input, { width: 60, textAlign: 'center' }]} />
      </View>

      <TouchableOpacity style={styles.btnSave}>
        <Text style={styles.btnText}>Guardar y Notificar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('EstadoCliente')} style={styles.btnNext}>
        <Text style={styles.btnNextText}>Siguiente: Vista del Cliente →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 0.5
  },
  warehouseBox: {
    padding: 15,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginBottom: 20
  },
  label: {
    marginBottom: 10,
    color: Colour.primary,
    fontWeight: 'bold'
  },
  btnSave: {
    backgroundColor: Colour.success,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  btnNext: {
    marginTop: 20
  },
  btnNextText: {
    color: Colour.primary,
    textAlign: 'center'
  }
});