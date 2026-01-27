// Firebase configuration - Robusto para APK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Modo desarrollo
export const DEV_MODE = false;

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAsKf8UOV9t5_Ctkzi4vnb5ktNy1SKJ3os",
    authDomain: "echo-beat-77c21.firebaseapp.com",
    projectId: "echo-beat-77c21",
    storageBucket: "echo-beat-77c21.firebasestorage.app",
    messagingSenderId: "367705500486",
    appId: "1:367705500486:web:ac0d5f3d6b312072d41347",
    measurementId: "G-QR9MZGRSB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configurar persistencia LOCAL (sobrevive a recargas y cierres de app)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log('✅ Firebase Auth: Persistencia LOCAL configurada');
    })
    .catch((error) => {
        console.warn('⚠️ Firebase Auth: No se pudo configurar persistencia:', error.message);
    });

// Provider de Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Analytics deshabilitado para evitar errores
export const analytics = null;

export default app;
