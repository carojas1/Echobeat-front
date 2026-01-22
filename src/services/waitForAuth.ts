import { getAuth, onAuthStateChanged } from "firebase/auth";

export function waitForAuth(): Promise<void> {
  const auth = getAuth();

  return new Promise((resolve) => {
    if (auth.currentUser) return resolve();

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve();
      }
    });
  });
}
