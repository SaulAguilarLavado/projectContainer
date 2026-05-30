import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colour from '../constants/Colour';

export default function CustomButton({ 
  onPress, 
  title, 
  style, 
  textStyle,
  variant = 'primary',
  disabled = false
}) {
  const buttonStyle = variant === 'primary' ? styles.primaryBtn : styles.secondaryBtn;
  
  return (
    <TouchableOpacity
      style={[buttonStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: Colour.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  secondaryBtn: {
    backgroundColor: Colour.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  buttonText: {
    color: Colour.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  disabled: {
    opacity: 0.5
  }
});
