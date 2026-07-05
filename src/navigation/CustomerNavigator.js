import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MyRepairsScreen from '../screens/customer/MyRepairsScreen';
import CatalogScreen from '../screens/shared/CatalogScreen';
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

const RepairsStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen
      name="MyRepairsScreen"
      component={MyRepairsScreen}
      options={{ title: 'Mis Reparaciones' }}
    />
  </Stack.Navigator>
);

const CatalogStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen
      name="CatalogScreen"
      component={CatalogScreen}
      options={{ title: 'Catálogo de Productos' }}
    />
  </Stack.Navigator>
);

export default function CustomerNavigator() {
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
          fontSize: 12,
          fontWeight: '500'
        }
      })}
    >
      <Tab.Screen
        name="MyRepairs"
        component={RepairsStack}
        options={{
          tabBarLabel: 'Mis Reparaciones',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📦</Text>
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogStack}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛍️</Text>
        }}
      />
    </Tab.Navigator>
  );
}
