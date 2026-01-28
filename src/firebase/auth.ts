import { auth, DEV_MODE } from './config';
import {
    signInWithPopup,
    signInWithCredential,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    GoogleAuthProvider
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

// Firebase error type
interface FirebaseAuthError extends Error {
    code?: string;
    message: string;
}

// Sign in with Google
export const signInWithGoogle = async () => {
    if (DEV_MODE) {
        console.log('🔧 Dev Mode: Skipping Google auth');
        return { user: null, token: 'dev-token', error: null };
    }

    // Check if we're running on a native platform (Capacitor)
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Use native Google Sign-In via Capacitor Firebase Authentication plugin
        try {
            console.log('📱 Using native Google Sign-In...');

            // Sign in with Google using native dialog
            const result = await FirebaseAuthentication.signInWithGoogle();

            if (result.user) {
                // Get the ID token from the native auth
                const idTokenResult = await FirebaseAuthentication.getIdToken();
                const idToken = idTokenResult.token;

                // Create credential and sign in with Firebase Web SDK for consistency
                const credential = GoogleAuthProvider.credential(idToken);
                const userCredential = await signInWithCredential(auth, credential);

                const token = await userCredential.user.getIdToken();
                return { user: userCredential.user, token, error: null };
            } else {
                return { user: null, token: null, error: 'No se pudo obtener la información del usuario.' };
            }
        } catch (error) {
            const authError = error as FirebaseAuthError;
            console.error('Native Google sign-in error:', authError);

            let errorMessage = 'Error iniciando sesión con Google.';
            if (authError.message?.includes('canceled') || authError.message?.includes('cancelled')) {
                errorMessage = 'Inicio de sesión cancelado.';
            } else if (authError.message?.includes('network')) {
                errorMessage = 'Error de red. Verifica tu conexión.';
            }

            return { user: null, token: null, error: errorMessage };
        }
    }

    // Web browser - use popup
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        return { user: result.user, token, error: null };
    } catch (error) {
        const authError = error as FirebaseAuthError;
        console.error('Google sign-in error:', authError);

        // Provide user-friendly error messages
        let errorMessage = authError.message;
        if (authError.code === 'auth/popup-blocked') {
            errorMessage = 'El popup fue bloqueado. Por favor, permite ventanas emergentes.';
        } else if (authError.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Cancelaste el inicio de sesión.';
        } else if (authError.message?.includes('missing initial state')) {
            errorMessage = 'Error de sesión. Por favor, intenta de nuevo o usa correo y contraseña.';
        }

        return { user: null, token: null, error: errorMessage };
    }
};

// Sign in with Email and Password
export const signInWithEmail = async (email: string, password: string) => {
    if (DEV_MODE) {
        console.log('🔧 Dev Mode: Skipping email auth');
        return { user: null, token: 'dev-token', error: null };
    }

    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const token = await result.user.getIdToken();
        return { user: result.user, token, error: null };
    } catch (error) {
        const authError = error as FirebaseAuthError;
        console.error('Email sign-in error:', authError);

        // User-friendly error messages
        let errorMessage = authError.message;
        if (authError.code === 'auth/invalid-credential') {
            errorMessage = 'Correo o contraseña incorrectos.';
        } else if (authError.code === 'auth/user-not-found') {
            errorMessage = 'No existe una cuenta con este correo.';
        } else if (authError.code === 'auth/wrong-password') {
            errorMessage = 'Contraseña incorrecta.';
        } else if (authError.code === 'auth/too-many-requests') {
            errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos.';
        }

        return { user: null, token: null, error: errorMessage };
    }
};

// Register with Email and Password
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
    if (DEV_MODE) {
        console.log('🔧 Dev Mode: Skipping registration');
        return { user: null, token: 'dev-token', error: null };
    }

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update user profile with display name
        await updateProfile(result.user, { displayName });

        // Get Firebase token
        const token = await result.user.getIdToken();

        return { user: result.user, token, error: null };
    } catch (error) {
        const authError = error as FirebaseAuthError;
        console.error('Registration error:', authError);

        // User-friendly error messages
        let errorMessage = authError.message;
        if (authError.code === 'auth/email-already-in-use') {
            errorMessage = 'Ya existe una cuenta con este correo.';
        } else if (authError.code === 'auth/weak-password') {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (authError.code === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico no es válido.';
        }

        return { user: null, token: null, error: errorMessage };
    }
};

// Sign out
export const logout = async () => {
    if (DEV_MODE) {
        console.log('🔧 Dev Mode: Mock logout');
        return { error: null };
    }

    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        const authError = error as FirebaseAuthError;
        console.error('Logout error:', authError);
        return { error: authError.message };
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    if (DEV_MODE) {
        return null;
    }
    return auth.currentUser;
};
