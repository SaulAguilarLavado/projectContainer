import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../../constants/Colour';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

/**
 * AddRepairScreen: Formulario para registrar nuevas órdenes de trabajo
 * - Valida entrada del usuario
 * - Almacena datos en AsyncStorage
 * - Navega después de guardar
 */
export default function AddRepairScreen({ navigation }) {
  const [prenda, setPrenda] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [hueco, setHueco] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!prenda.trim()) {
      newErrors.prenda = 'La prenda es requerida';
    }
    if (!costo || isNaN(costo)) {
      newErrors.costo = 'Ingrese un costo válido';
    }
    if (!fechaEntrega.trim()) {
      newErrors.fechaEntrega = 'La fecha es requerida';
    }
    if (!hueco.trim() || hueco.length > 1) {
      newErrors.hueco = 'Ingrese un hueco válido (A-Z)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Crear nuevo registro de reparación
      const newRepair = {
        id: Date.now().toString(),
        client: 'Cliente Nuevo',
        item: prenda,
        status: 'Pendiente',
        date: fechaEntrega,
        cost: costo,
        location: hueco,
        timestamp: new Date().toISOString()
      };

      // Obtener reparaciones existentes del AsyncStorage
      const existingRepairs = await AsyncStorage.getItem('admin_repairs');
      let repairs = existingRepairs ? JSON.parse(existingRepairs) : [];

      // Agregar nueva reparación
      repairs.unshift(newRepair);

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('admin_repairs', JSON.stringify(repairs));

      Alert.alert('Éxito', 'Reparación guardada correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('EstadoCliente') }
      ]);

      // Limpiar formulario
      setPrenda('');
      setCosto('');
      setFechaEntrega('');
      setHueco('');
    } catch (error) {
      console.error('Error guardando reparación:', error);
      Alert.alert('Error', 'No se pudo guardar la reparación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomInput
        label="Prenda"
        placeholder="ej: Pantalón Jean"
        value={prenda}
        onChangeText={setPrenda}
        error={errors.prenda}
      />

      <CustomInput
        label="Costo (S/.)"
        placeholder="50.00"
        value={costo}
        onChangeText={setCosto}
        keyboardType="decimal-pad"
        error={errors.costo}
      />

      <CustomInput
        label="Fecha Entrega"
        placeholder="dd/mm/yyyy"
        value={fechaEntrega}
        onChangeText={setFechaEntrega}
        error={errors.fechaEntrega}
      />

      <View style={styles.warehouseBox}>
        <CustomInput
          label="Ubicación en Almacén (Hueco A-Z)"
          placeholder="A"
          value={hueco}
          onChangeText={(text) => setHueco(text.toUpperCase())}
          maxLength={1}
          error={errors.hueco}
        />
      </View>

      <CustomButton
        title="Guardar y Notificar"
        onPress={handleGuardar}
        disabled={loading}
        variant="primary"
        style={styles.btnSave}
      />

      <CustomButton
        title="Siguiente: Vista del Cliente →"
        onPress={() => navigation.navigate('EstadoCliente')}
        variant="secondary"
        style={styles.btnNext}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colour.background
  },
  warehouseBox: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colour.primary
  },
  btnSave: {
    marginBottom: 10
  },
  btnNext: {
    marginBottom: 30
  }
});