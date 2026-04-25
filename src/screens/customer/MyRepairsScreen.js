import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colour from '../../constants/Colour';

export default function MyRepairsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Reparación</Text>
      
      <View style={styles.statusCard}>
        <Text style={styles.itemTitle}>Pantalón Jean - Ajuste</Text>
        <Text style={styles.statusReady}>ESTADO: ¡LISTO PARA RECOGER!</Text>
        
        <View style={styles.locationBox}>
          <Text style={styles.locationLabel}>Búscalo en el Hueco:</Text>
          <Text style={styles.locationLetter}>H</Text> 
        </View>
      </View>

      <TouchableOpacity 
        style={styles.btnNext} 
        onPress={() => navigation.navigate('Catalogo')}
      >
        <Text style={styles.btnNextText}>Siguiente: Ver Catálogo →</Text>
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
    textAlign: 'center',
    marginBottom: 30
  },
  statusCard: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5
  },
  itemTitle: {
    fontSize: 18,
    marginBottom: 10
  },
  statusReady: {
    color: Colour.success,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20
  },
  locationBox: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EEE',
    paddingTop: 20,
    width: '100%'
  },
  locationLabel: {
    fontSize: 14,
    color: '#666'
  },
  locationLetter: {
    fontSize: 60,
    fontWeight: 'bold',
    color: Colour.primary
  },
  btnNext: {
    marginTop: 40,
    padding: 15,
    backgroundColor: Colour.secondary,
    borderRadius: 10
  },
  btnNextText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});