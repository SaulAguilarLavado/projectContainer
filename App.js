import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeNotifications } from './src/services/notifications';
import logger from './src/utils/logger';

export default function App() {
  useEffect(() => {
    initializeNotifications().catch(error => {
      logger.handled('notification_initialization_failed', error);
    });
  }, []);

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}
