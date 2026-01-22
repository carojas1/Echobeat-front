import { getAuth } from "firebase/auth";
import { waitForAuth } from "./waitForAuth";

export async function authFetch(url: string, options: RequestInit = {}) {
  await waitForAuth(); // ⬅️ CLAVE

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("NO_AUTH_USER");
  }

  const token = await user.getIdToken(true);

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  return res;
}
