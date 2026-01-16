import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonToast } from '@ionic/react';
import { logoGoogle, logoFacebook } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just navigate to home
    history.push('/main/home');
  };

  const handleSocialLogin = () => {
    // Mock social login
    history.push('/main/home');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="auth-container">
          <div className="auth-logo">
            <h1>EchoBeat</h1>
            <p>Your music, your vibe</p>
          </div>

          <div className="auth-card">
            {/* Social Login Buttons */}
            <div className="social-buttons">
              <button
                className="social-button google-button"
                onClick={handleSocialLogin}
              >
                <IonIcon icon={logoGoogle} />
                <span>Continuar con Google</span>
              </button>

              <button
                className="social-button facebook-button"
                onClick={handleSocialLogin}
              >
                <IonIcon icon={logoFacebook} />
                <span>Continuar con Facebook</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>o</span>
            </div>

            {/* Email/Password Login */}
            <form className="auth-form" onSubmit={handleLogin}>
              <IonItem lines="none">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonInput={(e: any) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel position="stacked">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </IonItem>

              <IonButton
                expand="block"
                className="auth-button"
                type="submit"
              >
                Iniciar Sesión
              </IonButton>
            </form>

            <div className="auth-link">
              ¿No tienes cuenta?
              <a onClick={() => history.push('/register')}>Regístrate aquí</a>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
