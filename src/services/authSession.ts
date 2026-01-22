import { getAuth, onAuthStateChanged, User } from "firebase/auth";

/**
 * Wait for Firebase auth user to be available
 * Handles race condition where currentUser might be null temporarily
 */
export async function waitForAuthUser(timeoutMs = 4000): Promise<User> {
  const auth = getAuth();

  // If already available, return immediately
  if (auth.currentUser) {
    return auth.currentUser;
  }

  // Wait for auth state to resolve
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsub();
      reject(new Error("Sesión expirada. Por favor inicia sesión nuevamente."));
    }, timeoutMs);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        clearTimeout(timer);
        unsub();
        resolve(user);
      }
    });
  });
}

/**
 * Get fresh Firebase ID Token
 * ALWAYS waits for auth user to be available
 */
export async function getFreshIdToken(): Promise<string> {
  const user = await waitForAuthUser();
  
  console.log("🔑 Getting token for:", user.email);
  
  // Force refresh to get fresh token
  const token = await user.getIdToken(true);
  
  console.log("🔑 Token length:", token.length);
  
  return token;
}
