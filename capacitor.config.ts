import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echobeat.app',
  appName: 'EchoBeat',
  webDir: 'dist',

  // Server configuration for production
  server: {
    androidScheme: 'https',
    cleartext: false,
  },

  // All plugins configuration
  plugins: {
    // StatusBar - Dark theme
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#000000',
    },

    // Keyboard - Dark style
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },

    // SplashScreen - Black background
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Local Notifications
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#3B82F6',
      sound: 'beep.wav',
    },

    // Filesystem - For music downloads
    Filesystem: {
      // No specific config needed
    },

    // Network - Connection detection
    Network: {
      // No specific config needed
    },

    // Toast - Native toasts
    Toast: {
      // No specific config needed
    },

    // Share - Social sharing
    Share: {
      // No specific config needed
    },

    // Browser - External links
    Browser: {
      // No specific config needed
    },

    // App - App state management
    App: {
      // No specific config needed
    },

    // Haptics - Vibration feedback
    Haptics: {
      // No specific config needed
    },

    // Device - Device info
    Device: {
      // No specific config needed
    },

    // Preferences - Local storage
    Preferences: {
      // No specific config needed
    },

    // Firebase Authentication - Native Google Sign-In
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
  },

  // Android specific configuration
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#000000',
  },
};

export default config;
