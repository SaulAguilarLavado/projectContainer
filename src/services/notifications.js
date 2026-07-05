import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import logger from '../utils/logger';

const CHANNEL_ID = 'reparaciones';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export const initializeNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Estado de reparaciones',
      description: 'Avisos al registrar o actualizar una reparación.',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#2E5A88'
    });
  }
};

export const requestNotificationPermission = async () => {
  await initializeNotifications();
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }
  logger.info('notification_permission_checked', {
    status: permission.status,
    canAskAgain: permission.canAskAgain
  });
  return permission;
};

export const notifyRepairCreated = async repair => {
  const permission = await requestNotificationPermission();
  if (!permission.granted) return { delivered: false, permission };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reparación registrada',
      body: `${repair.item} de ${repair.client} quedó registrada para el ${repair.date}.`,
      data: { repairId: repair.id, type: 'repair-created' },
      sound: true
    },
    trigger: Platform.OS === 'android' ? { channelId: CHANNEL_ID } : null
  });
  logger.info('local_notification_scheduled', { type: 'repair-created', repairId: repair.id });
  return { delivered: true, permission };
};

export const notifyRepairStatusChanged = async repair => {
  const permission = await requestNotificationPermission();
  if (!permission.granted) return { delivered: false, permission };

  const readyText = repair.status === 'Completado'
    ? 'Ya está lista para recoger.'
    : `Ahora está: ${repair.status}.`;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Actualización: ${repair.item}`,
      body: `${repair.client}, ${readyText}`,
      data: { repairId: repair.id, type: 'repair-status' },
      sound: true
    },
    trigger: Platform.OS === 'android' ? { channelId: CHANNEL_ID } : null
  });
  logger.info('local_notification_scheduled', { type: 'repair-status', repairId: repair.id });
  return { delivered: true, permission };
};
