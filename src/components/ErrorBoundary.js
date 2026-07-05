import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colour from '../constants/Colour';
import logger from '../utils/logger';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logger.error('ui_unhandled_error', error, { componentStack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>🧵</Text>
        <Text style={styles.title}>Algo salió mal</Text>
        <Text style={styles.message}>La aplicación controló el error. Puedes intentar volver a la pantalla.</Text>
        <TouchableOpacity style={styles.button} onPress={() => this.setState({ hasError: false })}>
          <Text style={styles.buttonText}>Intentar nuevamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: Colour.background },
  icon: { fontSize: 42, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: Colour.primary },
  message: { marginVertical: 14, textAlign: 'center', color: Colour.text, lineHeight: 21 },
  button: { backgroundColor: Colour.primary, borderRadius: 10, padding: 14, marginTop: 8 },
  buttonText: { color: Colour.white, fontWeight: 'bold', textAlign: 'center' }
});
