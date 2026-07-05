import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AddRepairScreen from '../screens/admin/AddRepairScreen';
import AdminRepairsStatusScreen from '../screens/admin/AdminRepairsStatusScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import LogoutButton from '../components/LogoutButton';
import Colour from '../constants/Colour';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const stackScreenOptions = ({ navigation }) => ({
  headerStyle: { backgroundColor: Colour.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerRight: () => <LogoutButton navigation={navigation} />
});

const AdminHomeStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen
      name="AdminHomeScreen"
      component={AdminHomeScreen}
      options={{ title: 'Reparaciones' }}
    />
    <Stack.Screen
      name="NuevaReparacion"
      component={AddRepairScreen}
      options={{ title: 'Nueva Reparación' }}
    />
  </Stack.Navigator>
);

const CatalogStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen
      name="AdminProductsScreen"
      component={AdminProductsScreen}
      options={{ title: 'Gestión de Productos' }}
    />
  </Stack.Navigator>
);

const StatusStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen
      name="AdminRepairsStatusScreen"
      component={AdminRepairsStatusScreen}
      options={{ title: 'Estado de Reparaciones' }}
    />
  </Stack.Navigator>
);

const UsersStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen
      name="AdminUsersScreen"
      component={AdminUsersScreen}
      options={{ title: 'Usuarios Registrados' }}
    />
  </Stack.Navigator>
);

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colour.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500'
        }
      })}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeStack}
        options={{
          tabBarLabel: 'Reparaciones',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogStack}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📦</Text>
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusStack}
        options={{
          tabBarLabel: 'Estado',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔧</Text>
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersStack}
        options={{
          tabBarLabel: 'Usuarios',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text>
        }}
      />
    </Tab.Navigator>
  );
}
