import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Colour from '../../constants/Colour';

const products = [
  { id: 1, name: 'Hilo Seda', price: '15.00', stock: 10 },
  { id: 2, name: 'Botones x10', price: '5.00', stock: 50 },
  { id: 3, name: 'Aguja Industrial', price: '2.50', stock: 0 },
];

export default function CatalogScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Catálogo de Productos</Text>
      <View style={styles.grid}>
        {products.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imgPlaceholder} />
            <Text style={styles.prodName}>{item.name}</Text>
            <Text style={styles.prodPrice}>S/ {item.price}</Text>
            <Text style={[styles.stock, { color: item.stock > 0 ? 'green' : 'red' }]}>
              Stock: {item.stock}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btnEnd}>
        <Text style={styles.btnEndText}>Volver al Inicio (Demo terminada)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3
  },
  imgPlaceholder: {
    height: 100,
    backgroundColor: '#DDD',
    borderRadius: 8,
    marginBottom: 5
  },
  prodName: {
    fontWeight: 'bold'
  },
  prodPrice: {
    color: Colour.primary
  },
  stock: {
    fontSize: 12
  },
  btnEnd: {
    marginVertical: 30,
    padding: 15,
    backgroundColor: Colour.text,
    borderRadius: 10
  },
  btnEndText: {
    color: '#FFF',
    textAlign: 'center'
  }
});