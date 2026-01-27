import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echobeat.app',
  appName: 'EchoBeat',
  webDir: 'dist',
  
  // Configuración del servidor para producción
  server: {
    // En producción, usa los archivos locales (no un servidor remoto)
    androidScheme: 'https',
    // Permitir cleartext solo para desarrollo local
    cleartext: false,
  },
  
  // Plugins configuration
  plugins: {
    // StatusBar config
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#121212',
    },
    // Keyboard config
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    // SplashScreen config
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#121212',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
  
  // Android specific config
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false, // false para producción
  },
};

export default config;
