import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

const EXPO_GO_NOTIFICATION_MESSAGES = [
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go'
];

// Expo Go muestra avisos sobre push remoto al importar el módulo. Esta app usa
// únicamente notificaciones locales, que sí están disponibles en Expo Go.
LogBox.ignoreLogs(EXPO_GO_NOTIFICATION_MESSAGES);

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const isExpoGoNotificationNotice = args => {
  const message = args.map(String).join(' ');
  return EXPO_GO_NOTIFICATION_MESSAGES.some(fragment => message.includes(fragment));
};

console.error = (...args) => {
  if (!isExpoGoNotificationNotice(args)) originalConsoleError(...args);
};
console.warn = (...args) => {
  if (!isExpoGoNotificationNotice(args)) originalConsoleWarn(...args);
};

const App = require('./App').default;

console.error = originalConsoleError;
console.warn = originalConsoleWarn;

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
