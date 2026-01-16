import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { logoGoogle, logoFacebook } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Register: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock register - just navigate to home
        history.push('/main/home');
    };

    const handleSocialRegister = () => {
        // Mock social register
        history.push('/main/home');
    };

    return (
        <IonPage>
            <IonContent>
                <div className="auth-container">
                    <div className="auth-logo">
                        <h1>EchoBeat</h1>
                        <p>Únete a la comunidad musical</p>
                    </div>

                    <div className="auth-card">
                        {/* Social Register Buttons */}
                        <div className="social-buttons">
                            <button
                                className="social-button google-button"
                                onClick={handleSocialRegister}
                            >
                                <IonIcon icon={logoGoogle} />
                                <span>Continuar con Google</span>
                            </button>

                            <button
                                className="social-button facebook-button"
                                onClick={handleSocialRegister}
                            >
                                <IonIcon icon={logoFacebook} />
                                <span>Continuar con Facebook</span>
                            </button>
                        </div>

                        <div className="auth-divider">
                            <span>o</span>
                        </div>

                        {/* Email/Password Register */}
                        <form className="auth-form" onSubmit={handleRegister}>
                            <IonItem lines="none">
                                <IonLabel position="stacked">Nombre</IonLabel>
                                <IonInput
                                    type="text"
                                    value={name}
                                    onIonInput={(e: any) => setName(e.target.value)}
                                    placeholder="Tu nombre"
                                />
                            </IonItem>

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

                            <IonItem lines="none">
                                <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
                                <IonInput
                                    type="password"
                                    value={confirmPassword}
                                    onIonInput={(e: any) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </IonItem>

                            <IonButton
                                expand="block"
                                className="auth-button"
                                type="submit"
                            >
                                Crear Cuenta
                            </IonButton>
                        </form>

                        <div className="auth-link">
                            ¿Ya tienes cuenta?
                            <a onClick={() => history.push('/login')}>Inicia sesión</a>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
