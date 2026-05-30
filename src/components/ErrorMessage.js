import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colour from '../constants/Colour';

export default function ErrorMessage({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message || 'Ocurrió un error. Intente nuevamente.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colour.error,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5
  },
  errorText: {
    color: Colour.white,
    fontWeight: '600',
    textAlign: 'center'
  }
});
