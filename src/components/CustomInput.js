import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import Colour from '../constants/Colour';

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error = null,
  label = null,
  editable = true
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, !editable && styles.disabled]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#999"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colour.text,
    fontSize: 14
  },
  input: {
    backgroundColor: Colour.white,
    padding: 12,
    borderRadius: 8,
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
    marginTop: 4
  },
  disabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6
  }
});
