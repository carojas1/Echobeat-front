// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Modo desarrollo
export const DEV_MODE = true;

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

// Initialize Firebase - SIEMPRE inicializar
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = null;

export default app;
