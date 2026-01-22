import { auth, googleProvider, DEV_MODE } from './config';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    GoogleAuthProvider
} from 'firebase/auth';

// Sign in with Google
export const signInWithGoogle = async () => {
    if (DEV_MODE) {
        console.log('🔧 Dev Mode: Skipping Google auth');
        return { user: null, token: 'dev-token', error: null };
    }

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        return { user: result.user, token, error: null };
    } catch (error: any) {
        console.error('Google sign-in error:', error);
        return { user: null, token: null, error: error.message };
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
    } catch (error: any) {
        console.error('Email sign-in error:', error);
        return { user: null, token: null, error: error.message };
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
    } catch (error: any) {
        console.error('Registration error:', error);
        return { user: null, token: null, error: error.message };
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
    } catch (error: any) {
        console.error('Logout error:', error);
        return { error: error.message };
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    if (DEV_MODE) {
        return null;
    }
    return auth.currentUser;
};
