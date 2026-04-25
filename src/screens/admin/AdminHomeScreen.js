import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Colour from '../../constants/Colour';

// Datos de prueba estáticos
const pendingRepairs = [
  { id: '1', client: 'Juan Pérez', item: 'Saco Azul', status: 'Pendiente', date: '15/10' },
  { id: '2', client: 'Maria Luz', item: 'Vestido Gala', status: 'En Proceso', date: '16/10' },
];

export default function AdminHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trabajos del Día</Text>
      
      <FlatList
        data={pendingRepairs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.clientName}>{item.client}</Text>
              <Text>{item.item}</Text>
            </View>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.btnAdd}
        onPress={() => navigation.navigate('NuevaReparacion')}
      >
        <Text style={styles.btnText}>+ Nueva Reparación</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.btnNext} 
        onPress={() => navigation.navigate('NuevaReparacion')}
      >
        <Text style={styles.btnNextText}>Siguiente: Registrar Prenda →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colour.background },
  title: { fontSize: 22, fontWeight: 'bold', color: Colour.primary, marginBottom: 20 },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, elevation: 2 },
  clientName: { fontWeight: 'bold', fontSize: 16 },
  status: { color: Colour.secondary, fontWeight: 'bold' },
  btnAdd: { backgroundColor: Colour.primary, padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  btnNext: { marginTop: 20, padding: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: Colour.text },
  btnNextText: { textAlign: 'center', color: Colour.text }
});