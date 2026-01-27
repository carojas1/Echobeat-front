import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonToggle, IonModal, IonRange, IonLabel, IonList, IonItem } from '@ionic/react';
import { person, settings, notifications, helpCircle, shield, logOut, chevronForward, moon, sunny, volumeHigh, mail, key, time } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { auth } from '../firebase/config';
import api from '../services/api.service';
import './Profile.css';

interface UserProfile {
    displayName: string;
    email: string;
    photoURL: string | null;
    uid: string;
    creationTime?: string;
}

const Profile: React.FC = () => {
    const history = useHistory();
    const { isDark, toggleTheme } = useTheme();
    const { volume, setVolume } = usePlayer();
    
    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    
    const [user, setUser] = useState<UserProfile | null>(null);

    // Cargar datos del usuario
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser({
                displayName: currentUser.displayName || 'Usuario',
                email: currentUser.email || 'usuario@echobeat.com',
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                creationTime: currentUser.metadata.creationTime
            });
        }
        
        // Load notification preference
        const notifPref = localStorage.getItem('settings_notifications');
        if (notifPref !== null) setNotificationsEnabled(notifPref === 'true');
    }, []);

    const toggleNotifications = (e: CustomEvent) => {
        const val = e.detail.checked;
        setNotificationsEnabled(val);
        localStorage.setItem('settings_notifications', String(val));
    };

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            history.push('/login');
        }
    };

    const handleContactSupport = () => {
        window.open('mailto:carojas@sudamericnao.edu.ec?subject=Soporte%20EchoBeat', '_system');
    };

    const handleMenuClick = (id: number) => {
        if (id === 1) setShowSettings(!showSettings);
        if (id === 3) setShowPrivacy(true);
        if (id === 4) handleContactSupport();
    };

    const menuItems = [
        { id: 1, title: 'Configuración', subtitle: 'Tema, volumen y preferencias', icon: settings },
        { id: 2, title: 'Notificaciones', subtitle: 'Gestiona tus alertas', icon: notifications, isToggle: true },
        { id: 3, title: 'Privacidad', subtitle: 'Tus datos y seguridad', icon: shield },
        { id: 4, title: 'Ayuda y soporte', subtitle: 'Contáctanos', icon: helpCircle },
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/main/home" />
                    </IonButtons>
                    <IonTitle>Perfil</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName} className="avatar-image" />
                            ) : (
                                <IonIcon icon={person} />
                            )}
                        </div>
                        <h2 className="profile-name">{user?.displayName || 'Usuario EchoBeat'}</h2>
                        <p className="profile-email">{user?.email || 'usuario@echobeat.com'}</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <p className="stat-value">0</p>
                                <p className="stat-label">Subidas</p>
                            </div>
                            <div className="stat-item">
                                <p className="stat-value">0</p>
                                <p className="stat-label">Reproducciones</p>
                            </div>
                            <div className="stat-item">
                                <p className="stat-value">100</p>
                                <p className="stat-label">Créditos</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div className="profile-section">
                        <h3 className="section-title">General</h3>
                        <div className="profile-menu">
                            {menuItems.map((item) => (
                                <div key={item.id} className="menu-item" onClick={() => !item.isToggle && handleMenuClick(item.id)}>
                                    <div className="menu-icon">
                                        <IonIcon icon={item.icon} />
                                    </div>
                                    <div className="menu-content">
                                        <h4 className="menu-title">{item.title}</h4>
                                        <p className="menu-subtitle">{item.subtitle}</p>
                                    </div>
                                    <div className="menu-action">
                                        {item.isToggle ? (
                                            <IonToggle 
                                                checked={notificationsEnabled} 
                                                onIonChange={toggleNotifications}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <IonIcon icon={chevronForward} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Settings Panel Expansion */}
                        {showSettings && (
                            <div className="settings-panel fade-in">
                                <div className="setting-header">Ajustes de la App</div>
                                
                                {/* Theme */}
                                <div className="setting-row">
                                    <div className="setting-info">
                                        <IonIcon icon={isDark ? moon : sunny} className="setting-icon-small" />
                                        <span>Tema {isDark ? 'Oscuro' : 'Claro'}</span>
                                    </div>
                                    <IonToggle checked={isDark} onIonChange={toggleTheme} />
                                </div>

                                {/* Volume */}
                                <div className="setting-row-col">
                                    <div className="setting-info">
                                        <IonIcon icon={volumeHigh} className="setting-icon-small" />
                                        <span>Volumen ({Math.round(volume * 100)}%)</span>
                                    </div>
                                    <IonRange 
                                        min={0} max={1} step={0.01} 
                                        value={volume} 
                                        onIonInput={(e) => setVolume(e.detail.value as number)}
                                        className="volume-slider-settings"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <IonButton
                        expand="block"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <IonIcon icon={logOut} slot="start" />
                        Cerrar Sesión
                    </IonButton>
                </div>

                {/* Privacy Modal */}
                <IonModal isOpen={showPrivacy} onDidDismiss={() => setShowPrivacy(false)} className="privacy-modal">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Datos Privados</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowPrivacy(false)}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <div className="privacy-content">
                            <IonIcon icon={shield} className="privacy-icon-large" />
                            <h3>Tus Datos en EchoBeat</h3>
                            <IonList lines="none">
                                <IonItem>
                                    <IonIcon icon={mail} slot="start" />
                                    <IonLabel>
                                        <h2>Email</h2>
                                        <p>{user?.email}</p>
                                    </IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonIcon icon={key} slot="start" />
                                    <IonLabel>
                                        <h2>User ID</h2>
                                        <p className="mono-text">{user?.uid}</p>
                                    </IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonIcon icon={time} slot="start" />
                                    <IonLabel>
                                        <h2>Miembro Desde</h2>
                                        <p>{user?.creationTime ? new Date(user.creationTime).toLocaleDateString() : 'N/A'}</p>
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                        </div>
                    </IonContent>
                </IonModal>

            </IonContent>
        </IonPage>
    );
};

export default Profile;
