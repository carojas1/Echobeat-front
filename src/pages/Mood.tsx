import React from "react";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import { person } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import "./Mood.css";

interface Mood {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

// Mood categories - sin canciones precargadas
const MOODS: Mood[] = [
  {
    id: "feliz",
    name: "Feliz",
    description: "Canciones alegres",
    icon: "😊",
    gradient: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
  },
  {
    id: "triste",
    name: "Triste",
    description: "Música emotiva",
    icon: "😢",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
  },
  {
    id: "energico",
    name: "Enérgico",
    description: "Ritmos potentes",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)",
  },
  {
    id: "relajado",
    name: "Relajado",
    description: "Melodías suaves",
    icon: "🌙",
    gradient: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
  },
  {
    id: "enfocado",
    name: "Enfocado",
    description: "Para concentrarte",
    icon: "🎯",
    gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
  },
  {
    id: "romantico",
    name: "Romántico",
    description: "Canciones de amor",
    icon: "❤️",
    gradient: "linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)",
  },
  {
    id: "motivador",
    name: "Motivador",
    description: "Alcanza tus metas",
    icon: "🔥",
    gradient: "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)",
  },
  {
    id: "nostalgico",
    name: "Nostálgico",
    description: "Recuerdos del pasado",
    icon: "🌅",
    gradient: "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)",
  },
];

interface User {
  displayName: string;
  photoURL: string | null;
}

const Mood: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || "Usuario",
        photoURL: currentUser.photoURL,
      });
    }
  }, []);

  const handleMoodClick = (moodId: string) => {
    // Navegar a la página de playlist filtrada por mood
    history.push(`/main/mood/${moodId}`);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="mood-container">
          {/* Header */}
          <div className="mood-header">
            <div className="header-top">
              <h2>Ambiente</h2>
              <div
                className="profile-avatar-btn"
                onClick={() => history.push("/main/profile")}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <IonIcon icon={person} />
                  </div>
                )}
              </div>
            </div>
            <p className="mood-subtitle">¿Cómo te sientes hoy?</p>
          </div>

          {/* Moods Grid */}
          <div className="moods-grid">
            {MOODS.map((mood) => (
              <div
                key={mood.id}
                className="mood-card glass"
                style={{ background: mood.gradient }}
                onClick={() => handleMoodClick(mood.id)}
              >
                <div className="mood-icon">{mood.icon}</div>
                <h3>{mood.name}</h3>
                <p className="mood-description">{mood.description}</p>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mood;
