import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonToast,
  IonButton,
  IonSpinner,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { arrowBack } from "ionicons/icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import Logo from "../components/Logo";
import "./Login.css";

const Register: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const saveUserData = async (user: {
    getIdToken: (arg: boolean) => Promise<string>;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  }) => {
    try {
      const idToken = await user.getIdToken(true);
      localStorage.setItem("fb_token", idToken);
      localStorage.setItem("user_email", user.email || "");
      localStorage.setItem("user_name", user.displayName || "");
      localStorage.setItem("user_photo", user.photoURL || "");
      return true;
    } catch (error) {
      console.error("Error guardando datos:", error);
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setToastMessage("Completa todos los campos");
      setShowToast(true);
      return;
    }

    if (password.length < 6) {
      setToastMessage("La contraseña debe tener al menos 6 caracteres");
      setShowToast(true);
      return;
    }

    if (password !== confirmPassword) {
      setToastMessage("Las contraseñas no coinciden");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, { displayName: name });
      await saveUserData(result.user);

      setToastMessage("✅ ¡Cuenta creada exitosamente!");
      setShowToast(true);
      setTimeout(() => history.replace("/main/home"), 1000);
    } catch (error: unknown) {
      console.error("Register error:", error);
      let msg = "Error al registrar";
      if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/email-already-in-use")
          msg = "Este correo ya está registrado";
        else if (code === "auth/weak-password")
          msg = "Contraseña muy débil (mínimo 6 caracteres)";
        else if (code === "auth/invalid-email")
          msg = "Correo electrónico inválido";
        else if (code === "auth/network-request-failed")
          msg = "Sin conexión a internet";
      }
      setToastMessage(msg);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      // Import dynamically to use the Capacitor-aware signInWithGoogle
      const { signInWithGoogle } = await import("../firebase/auth");
      const { user, error } = await signInWithGoogle();

      if (error) {
        setToastMessage(error);
        setShowToast(true);
        return;
      }

      if (user) {
        await saveUserData(user);
        setToastMessage("✅ ¡Registro con Google exitoso!");
        setShowToast(true);
        setTimeout(() => history.replace("/main/home"), 500);
      }
    } catch (error: unknown) {
      console.error("Google register error:", error);
      setToastMessage("Error registrando con Google");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className="login-page">
      <IonContent className="ion-padding" scrollY={true} fullscreen={true}>
        <div className="login-container">
          {/* Botón Volver */}
          <div style={{ alignSelf: "flex-start" }}>
            <IonButton
              fill="clear"
              color="light"
              onClick={() => history.push("/login")}
              disabled={loading}
            >
              <IonIcon slot="start" icon={arrowBack} />
              Volver
            </IonButton>
          </div>

          <div className="login-header">
            <Logo animated size="medium" />
            <h1>Crear Cuenta</h1>
            <p className="subtitle">Únete a EchoBeat</p>
          </div>

          <div className="login-form-box">
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="input-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <div className="input-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <IonButton
                expand="block"
                type="submit"
                className="main-button"
                disabled={loading}
              >
                {loading ? <IonSpinner name="crescent" /> : "REGISTRARME"}
              </IonButton>
            </form>

            <div className="divider">
              <span>O regístrate con</span>
            </div>

            <button
              className="google-btn"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
          color={toastMessage.includes("✅") ? "success" : "danger"}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
