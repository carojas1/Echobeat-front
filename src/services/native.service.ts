/**
 * EchoBeat Native Services
 * Unified service for all Capacitor native functionalities
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { Toast } from '@capacitor/toast';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

// ==================== PLATFORM CHECK ====================
export const isNative = (): boolean => Capacitor.isNativePlatform();
export const getPlatform = (): string => Capacitor.getPlatform();

// ==================== NOTIFICATIONS ====================
export const initNotifications = async (): Promise<boolean> => {
  if (!isNative()) return false;
  
  try {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
};

export const sendNotification = async (
  title: string,
  body: string,
  id: number = Date.now()
): Promise<void> => {
  if (!isNative()) {
    // Web fallback: use browser notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    return;
  }
  
  await LocalNotifications.schedule({
    notifications: [{
      id,
      title,
      body,
      schedule: { at: new Date(Date.now() + 100) }, // immediate
      sound: undefined,
      actionTypeId: '',
      extra: null
    }]
  });
};

export const sendMusicNotification = async (
  songTitle: string,
  artist: string
): Promise<void> => {
  await sendNotification(
    '🎵 Reproduciendo',
    `${songTitle} - ${artist}`
  );
};

// ==================== TOAST (Native) ====================
export const showToast = async (message: string, duration: 'short' | 'long' = 'short'): Promise<void> => {
  if (!isNative()) {
    // Web fallback: console log (IonToast should be used in components)
    console.log('Toast:', message);
    return;
  }
  
  await Toast.show({
    text: message,
    duration,
    position: 'bottom'
  });
};

// ==================== SHARE ====================
export const shareSong = async (
  songTitle: string,
  artist: string,
  url?: string
): Promise<void> => {
  const shareData = {
    title: `${songTitle} - ${artist}`,
    text: `🎵 Escucha "${songTitle}" de ${artist} en EchoBeat!`,
    url: url || 'https://echobeat.app',
    dialogTitle: 'Compartir canción'
  };
  
  if (!isNative()) {
    // Web Share API fallback
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      console.log('Link copied to clipboard');
    }
    return;
  }
  
  await Share.share(shareData);
};

// ==================== NETWORK ====================
export const getNetworkStatus = async (): Promise<{ connected: boolean; connectionType: string }> => {
  const status = await Network.getStatus();
  return {
    connected: status.connected,
    connectionType: status.connectionType
  };
};

export const addNetworkListener = (
  callback: (connected: boolean) => void
): (() => void) => {
  const handler = Network.addListener('networkStatusChange', (status) => {
    callback(status.connected);
  });
  
  // Return cleanup function
  return () => {
    handler.then(h => h.remove());
  };
};

// ==================== DEVICE INFO ====================
export const getDeviceInfo = async (): Promise<{
  model: string;
  platform: string;
  osVersion: string;
  manufacturer: string;
}> => {
  const info = await Device.getInfo();
  return {
    model: info.model,
    platform: info.platform,
    osVersion: info.osVersion,
    manufacturer: info.manufacturer
  };
};

export const getDeviceId = async (): Promise<string> => {
  const id = await Device.getId();
  return id.identifier;
};

// ==================== HAPTICS (Vibration) ====================
export const vibrate = async (style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> => {
  if (!isNative()) return;
  
  const impactStyle = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy
  }[style];
  
  await Haptics.impact({ style: impactStyle });
};

export const vibrateOnPlay = async (): Promise<void> => {
  await vibrate('light');
};

// ==================== APP LIFECYCLE ====================
export const addAppStateListener = (
  callback: (isActive: boolean) => void
): (() => void) => {
  const handler = App.addListener('appStateChange', ({ isActive }) => {
    callback(isActive);
  });
  
  return () => {
    handler.then(h => h.remove());
  };
};

export const addBackButtonListener = (
  callback: () => void
): (() => void) => {
  const handler = App.addListener('backButton', () => {
    callback();
  });
  
  return () => {
    handler.then(h => h.remove());
  };
};

// ==================== BROWSER (External Links) ====================
export const openExternalUrl = async (url: string): Promise<void> => {
  if (!isNative()) {
    window.open(url, '_blank');
    return;
  }
  
  await Browser.open({ url });
};

// ==================== VOLUME (Web Audio API based) ====================
// Note: Native volume control requires platform-specific implementation
// This uses the existing PlayerContext volume for web

export default {
  // Platform
  isNative,
  getPlatform,
  
  // Notifications
  initNotifications,
  sendNotification,
  sendMusicNotification,
  
  // Toast
  showToast,
  
  // Share
  shareSong,
  
  // Network
  getNetworkStatus,
  addNetworkListener,
  
  // Device
  getDeviceInfo,
  getDeviceId,
  
  // Haptics
  vibrate,
  vibrateOnPlay,
  
  // App Lifecycle
  addAppStateListener,
  addBackButtonListener,
  
  // Browser
  openExternalUrl
};
