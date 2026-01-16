import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { musicalNotes, heart, disc } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Library.css';

const Library: React.FC = () => {
    const history = useHistory();
    const [activeTab, setActiveTab] = useState('playlists');

    const playlists = [
        { id: 1, name: 'Mis Favoritas', description: '45 canciones', icon: heart },
        { id: 2, name: 'Rock Clásico', description: '32 canciones', icon: musicalNotes },
        { id: 3, name: 'Workout Mix', description: '28 canciones', icon: disc },
        { id: 4, name: 'Estudio', description: '56 canciones', icon: musicalNotes },
    ];

    const likedSongs = [
        {
            id: 1,
            name: 'SICKO MODE',
            artist: 'Travis Scott',
            duration: '5:13',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png'
        },
        {
            id: 2,
            name: 'Tití Me Preguntó',
            artist: 'Bad Bunny',
            duration: '4:03',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png'
        },
        {
            id: 3,
            name: 'Provenza',
            artist: 'Karol G',
            duration: '3:32',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png'
        },
        {
            id: 4,
            name: 'FE!N',
            artist: 'Travis Scott',
            duration: '3:12',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png'
        },
        {
            id: 5,
            name: 'Ella Baila Sola',
            artist: 'Peso Pluma',
            duration: '2:42',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png'
        },
    ];

    const albumsList = [
        {
            id: 'astroworld',
            name: 'ASTROWORLD',
            artist: 'Travis Scott',
            year: '2018',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png'
        },
        {
            id: 'utopia',
            name: 'UTOPIA',
            artist: 'Travis Scott',
            year: '2023',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png'
        },
        {
            id: 'un-verano-sin-ti',
            name: 'Un Verano Sin Ti',
            artist: 'Bad Bunny',
            year: '2022',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png'
        },
        {
            id: 'manana-sera-bonito',
            name: 'Mañana Será Bonito',
            artist: 'Karol G',
            year: '2023',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png'
        },
        {
            id: 'genesis',
            name: 'Génesis',
            artist: 'Peso Pluma',
            year: '2023',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png'
        },
        {
            id: 'feliz-cumpleanos-ferxxo',
            name: 'FELIZ CUMPLEAÑOS FERXXO',
            artist: 'Feid',
            year: '2022',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png'
        },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'playlists':
                return (
                    <div className="library-list">
                        {playlists.map((playlist) => (
                            <div key={playlist.id} className="library-item">
                                <div className="library-cover">
                                    <IonIcon icon={playlist.icon} />
                                </div>
                                <div className="library-info">
                                    <h4>{playlist.name}</h4>
                                    <p>{playlist.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'liked':
                return (
                    <div className="library-list">
                        {likedSongs.map((song) => (
                            <div key={song.id} className="library-item">
                                <div className="library-cover library-cover-image">
                                    <img src={song.cover} alt={song.name} />
                                </div>
                                <div className="library-info">
                                    <h4>{song.name}</h4>
                                    <p>{song.artist}</p>
                                </div>
                                <div className="library-meta">{song.duration}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'albums':
                return (
                    <div className="library-list">
                        {albumsList.map((album) => (
                            <div
                                key={album.id}
                                className="library-item"
                                onClick={() => history.push(`/main/album/${album.id}`)}
                            >
                                <div className="library-cover library-cover-image">
                                    <img src={album.cover} alt={album.name} />
                                </div>
                                <div className="library-info">
                                    <h4>{album.name}</h4>
                                    <p>{album.artist}</p>
                                </div>
                                <div className="library-meta">{album.year}</div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <IonPage>
            <IonContent>
                <div className="library-container">
                    <div className="library-header">
                        <h2>Tu Biblioteca</h2>
                        <p>Toda tu música en un solo lugar</p>
                    </div>

                    <div className="library-tabs">
                        <div
                            className={`library-tab ${activeTab === 'playlists' ? 'active' : ''}`}
                            onClick={() => setActiveTab('playlists')}
                        >
                            Playlists
                        </div>
                        <div
                            className={`library-tab ${activeTab === 'liked' ? 'active' : ''}`}
                            onClick={() => setActiveTab('liked')}
                        >
                            Me gusta
                        </div>
                        <div
                            className={`library-tab ${activeTab === 'albums' ? 'active' : ''}`}
                            onClick={() => setActiveTab('albums')}
                        >
                            Álbumes
                        </div>
                    </div>

                    {renderContent()}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Library;
