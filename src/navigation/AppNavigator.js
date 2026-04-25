import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AddRepairScreen from '../screens/admin/AddRepairScreen';
import MyRepairsScreen from '../screens/customer/MyRepairsScreen';
import CatalogScreen from '../screens/shared/CatalogScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2E5A88' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegisterScreen} />
      <Stack.Screen name="PanelCosturera" component={AdminHomeScreen} />
      <Stack.Screen name="NuevaReparacion" component={AddRepairScreen} />
      <Stack.Screen name="EstadoCliente" component={MyRepairsScreen} />
      <Stack.Screen name="Catalogo" component={CatalogScreen} />
    </Stack.Navigator>
  );
}