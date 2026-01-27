import React from "react";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import { person } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import "./Mood.css";

interface MoodType {
  id: string;
  name: string;
  phrase: string;
  gradient: string;
  accentColor: string;
}

// Mood categories - diseño elegante con frases y colores
const MOODS: MoodType[] = [
  {
    id: "feliz",
    name: "Feliz",
    phrase: "Deja que la alegría llene tu día",
    gradient: "linear-gradient(145deg, rgba(252, 211, 77, 0.25) 0%, rgba(251, 191, 36, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#FCD34D",
  },
  {
    id: "triste",
    name: "Triste",
    phrase: "A veces el alma necesita llorar",
    gradient: "linear-gradient(145deg, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#60A5FA",
  },
  {
    id: "energico",
    name: "Enérgico",
    phrase: "Siente la adrenalina en cada beat",
    gradient: "linear-gradient(145deg, rgba(244, 114, 182, 0.25) 0%, rgba(236, 72, 153, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#F472B6",
  },
  {
    id: "relajado",
    name: "Relajado",
    phrase: "Respira profundo y déjate llevar",
    gradient: "linear-gradient(145deg, rgba(167, 139, 250, 0.25) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#A78BFA",
  },
  {
    id: "enfocado",
    name: "Enfocado",
    phrase: "Tu mente es tu mejor instrumento",
    gradient: "linear-gradient(145deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#34D399",
  },
  {
    id: "romantico",
    name: "Romántico",
    phrase: "El amor suena mejor con música",
    gradient: "linear-gradient(145deg, rgba(251, 113, 133, 0.25) 0%, rgba(244, 63, 94, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#FB7185",
  },
  {
    id: "motivador",
    name: "Motivador",
    phrase: "Hoy es el día de lograr lo imposible",
    gradient: "linear-gradient(145deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#FBBF24",
  },
  {
    id: "nostalgico",
    name: "Nostálgico",
    phrase: "Los recuerdos tienen su propia melodía",
    gradient: "linear-gradient(145deg, rgba(129, 140, 248, 0.25) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(20, 20, 30, 0.95) 100%)",
    accentColor: "#818CF8",
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
                className="mood-card"
                style={{ 
                  background: mood.gradient,
                  borderColor: mood.accentColor 
                }}
                onClick={() => handleMoodClick(mood.id)}
              >
                <h3 style={{ color: mood.accentColor }}>{mood.name}</h3>
                <p className="mood-phrase">{mood.phrase}</p>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mood;
