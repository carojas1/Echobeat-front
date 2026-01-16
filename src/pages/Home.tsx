import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonSearchbar } from '@ionic/react';
import { person, play } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  const albums = [
    {
      id: 'astroworld',
      name: 'ASTROWORLD',
      artist: 'Travis Scott',
      cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png'
    },
    {
      id: 'utopia',
      name: 'UTOPIA',
      artist: 'Travis Scott',
      cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png'
    },
    {
      id: 'un-verano-sin-ti',
      name: 'Un Verano Sin Ti',
      artist: 'Bad Bunny',
      cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png'
    },
    {
      id: 'manana-sera-bonito',
      name: 'Mañana Será Bonito',
      artist: 'Karol G',
      cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png'
    },
    {
      id: 'genesis',
      name: 'Génesis',
      artist: 'Peso Pluma',
      cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png'
    },
    {
      id: 'feliz-cumpleanos-ferxxo',
      name: 'FELIZ CUMPLEAÑOS FERXXO',
      artist: 'Feid',
      cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png'
    },
  ];

  return (
    <IonPage>
      <IonContent>
        <div className="home-container">
          {/* Header with Profile and Search */}
          <div className="home-header">
            <div className="header-top">
              <h2>EchoBeat</h2>
              <div className="profile-button" onClick={() => history.push('/main/profile')}>
                <IonIcon icon={person} />
              </div>
            </div>
            <IonSearchbar
              value={searchText}
              onIonInput={(e: any) => setSearchText(e.target.value)}
              placeholder="¿Qué quieres escuchar?"
              className="search-bar"
              mode="ios"
            />
          </div>

          {/* Albums Grid - Spotify Style */}
          <div className="albums-section">
            <div className="albums-grid">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="album-card-grid"
                  onClick={() => history.push(`/main/album/${album.id}`)}
                >
                  <div className="album-cover-grid">
                    <img src={album.cover} alt={album.name} />
                    <div className="play-overlay">
                      <IonIcon icon={play} />
                    </div>
                  </div>
                  <div className="album-info">
                    <h4>{album.name}</h4>
                    <p>{album.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Music Player */}
        {/* Music Player Removed - will be replaced by global player */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
