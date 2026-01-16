import React from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { happy, sad, flash, leaf, sparkles, bulb, heart, moon } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Mood.css';

const Mood: React.FC = () => {
    const history = useHistory();

    const moods = [
        { id: 'feliz', name: 'Feliz', icon: happy, className: 'mood-happy' },
        { id: 'triste', name: 'Triste', icon: sad, className: 'mood-sad' },
        { id: 'energetico', name: 'Energético', icon: flash, className: 'mood-energetic' },
        { id: 'relajado', name: 'Relajado', icon: leaf, className: 'mood-relaxed' },
        { id: 'fiesta', name: 'Fiesta', icon: sparkles, className: 'mood-party' },
        { id: 'concentracion', name: 'Concentración', icon: bulb, className: 'mood-focus' },
        { id: 'romantico', name: 'Romántico', icon: heart, className: 'mood-romantic' },
        { id: 'chill', name: 'Chill', icon: moon, className: 'mood-chill' },
    ];

    return (
        <IonPage>
            <IonContent>
                <div className="mood-container">
                    <div className="mood-header">
                        <h2>Mood</h2>
                        <p>Encuentra música según tu estado de ánimo</p>
                    </div>

                    <div className="mood-grid">
                        {moods.map((mood) => (
                            <div
                                key={mood.id}
                                className={`mood-card ${mood.className}`}
                                onClick={() => history.push(`/main/mood/${mood.id}`)}
                            >
                                <h3>{mood.name}</h3>
                                <div className="mood-icon">
                                    <IonIcon icon={mood.icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Mood;
