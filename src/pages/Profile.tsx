import React from 'react';
import { IonContent, IonPage, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { person, settings, notifications, helpCircle, shield, logOut, chevronForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
    const history = useHistory();

    const handleLogout = () => {
        // In production, clear auth tokens
        history.push('/login');
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
                            <IonIcon icon={person} />
                        </div>
                        <h2 className="profile-name">Usuario EchoBeat</h2>
                        <p className="profile-email">usuario@echobeat.com</p>

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
                                <div key={item.id} className="menu-item">
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
