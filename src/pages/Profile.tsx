import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonToggle } from '@ionic/react';
import { person, settings, notifications, helpCircle, shield, logOut, chevronForward, moon, sunny } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../firebase/config';
import api from '../services/api.service';
import './Profile.css';

const Profile: React.FC = () => {
    const history = useHistory();
    const { isDark, toggleTheme } = useTheme();
    const [showSettings, setShowSettings] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Cargar datos del usuario de Firebase Auth
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser({
                displayName: currentUser.displayName || 'Usuario',
                email: currentUser.email || 'usuario@echobeat.com',
                photoURL: currentUser.photoURL
            });
        } else {
            setUser({
                displayName: 'Usuario',
                email: 'usuario@echobeat.com',
                photoURL: null
            });
        }
    }, []);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            history.push('/login');
        }
    };

    const handleMenuClick = (id: number) => {
        if (id === 1) { // Configuración
            setShowSettings(!showSettings);
        }
    };

    const menuItems = [
        { id: 1, title: 'Configuración', subtitle: 'Preferencias de la app', icon: settings },
        { id: 2, title: 'Notificaciones', subtitle: 'Gestiona tus alertas', icon: notifications },
        { id: 3, title: 'Privacidad', subtitle: 'Controla tu información', icon: shield },
        { id: 4, title: 'Ayuda y soporte', subtitle: 'Obtén asistencia', icon: helpCircle },
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
                                <p className="stat-value">24</p>
                                <p className="stat-label">Playlists</p>
                            </div>
                            <div className="stat-item">
                                <p className="stat-value">156</p>
                                <p className="stat-label">Seguidores</p>
                            </div>
                            <div className="stat-item">
                                <p className="stat-value">89</p>
                                <p className="stat-label">Siguiendo</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div className="profile-section">
                        <h3 className="section-title">Configuración</h3>
                        <div className="profile-menu">
                            {menuItems.map((item) => (
                                <div key={item.id} className="menu-item" onClick={() => handleMenuClick(item.id)}>
                                    <div className="menu-icon">
                                        <IonIcon icon={item.icon} />
                                    </div>
                                    <div className="menu-content">
                                        <h4 className="menu-title">{item.title}</h4>
                                        <p className="menu-subtitle">{item.subtitle}</p>
                                    </div>
                                    <div className="menu-arrow">
                                        <IonIcon icon={chevronForward} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Settings Panel */}
                        {showSettings && (
                            <div className="settings-panel">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <IonIcon icon={isDark ? moon : sunny} className="setting-icon" />
                                        <div>
                                            <h4 className="setting-title">Tema de la aplicación</h4>
                                            <p className="setting-description">
                                                {isDark ? 'Modo oscuro activo' : 'Modo claro activo'}
                                            </p>
                                        </div>
                                    </div>
                                    <IonToggle
                                        checked={isDark}
                                        onIonChange={toggleTheme}
                                        className="theme-toggle"
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
            </IonContent>
        </IonPage>
    );
};

export default Profile;
