import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AdminNavigator from './AdminNavigator';
import CustomerNavigator from './CustomerNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2E5A88' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro"
        component={RegisterScreen}
        options={{ title: 'Registro' }}
      />
      <Stack.Screen
        name="AdminApp"
        component={AdminNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomerApp"
        component={CustomerNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}