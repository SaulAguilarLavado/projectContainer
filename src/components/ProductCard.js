import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colour from '../constants/Colour';

export default function ProductCard({ product, onPress }) {
  const isOutOfStock = product.stock === 0;
  
  return (
    <TouchableOpacity 
      style={[styles.card, isOutOfStock && styles.outOfStock]} 
      onPress={onPress}
      disabled={isOutOfStock}
    >
      {product.photoUrl ? (
        <Image source={{ uri: product.photoUrl }} style={styles.productImage} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>
        S/ {parseFloat(product.price).toFixed(2)}
      </Text>
      <Text style={[
        styles.stock, 
        { color: product.stock > 0 ? Colour.success : Colour.error }
      ]}>
        {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colour.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden'
  },
  outOfStock: {
    opacity: 0.6
  },
  productImage: {
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#DDD'
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: '#DDD',
    borderRadius: 8,
    marginBottom: 8
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: Colour.text
  },
  price: {
    color: Colour.primary,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4
  },
  stock: {
    fontSize: 12,
    fontWeight: '500'
  }
});
