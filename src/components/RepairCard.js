import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colour from '../constants/Colour';

export default function RepairCard({ 
  item, 
  onPress 
}) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pendiente':
        return Colour.error;
      case 'En Proceso':
        return '#FFA500';
      case 'Completado':
        return Colour.success;
      default:
        return Colour.text;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {item.photoUrl && (
        <Image source={{ uri: item.photoUrl }} style={styles.photo} resizeMode="cover" />
      )}
      <View style={styles.content}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.itemText}>{item.item}</Text>
        <Text style={styles.dateText}>Fecha: {item.date}</Text>
        <Text style={styles.dateText}>Almacén: {item.location} · S/ {Number(item.cost).toFixed(2)}</Text>
      </View>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colour.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'column',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colour.primary
  },
  photo: {
    width: '100%',
    height: 145,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#E8ECEF'
  },
  content: {
    flex: 1,
    marginBottom: 8
  },
  clientName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colour.text,
    marginBottom: 4
  },
  itemText: {
    fontSize: 14,
    color: Colour.text,
    marginBottom: 4
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4
  },
  status: {
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'flex-end'
  }
});
