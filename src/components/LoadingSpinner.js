import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Colour from '../constants/Colour';

export default function LoadingSpinner({ size = 'large', color = Colour.primary }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colour.background
  }
});
