import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { home, heart, musicalNotes } from 'ionicons/icons';
import Home from './Home';
import Mood from './Mood';
import Library from './Library';
import Profile from './Profile';
import AlbumDetail from './AlbumDetail';
import MoodPlaylist from './MoodPlaylist';
import MiniPlayer from '../components/MiniPlayer';

const MainTabs: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/main/home">
                    <Home />
                </Route>
                <Route exact path="/main/mood">
                    <Mood />
                </Route>
                <Route exact path="/main/mood/:moodId">
                    <MoodPlaylist />
                </Route>
                <Route exact path="/main/library">
                    <Library />
                </Route>
                <Route exact path="/main/profile">
                    <Profile />
                </Route>
                <Route exact path="/main/album/:albumId">
                    <AlbumDetail />
                </Route>
                <Route exact path="/main">
                    <Redirect to="/main/home" />
                </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/main/home">
                    <IonIcon icon={home} />
                    <IonLabel>Inicio</IonLabel>
                </IonTabButton>

                <IonTabButton tab="mood" href="/main/mood">
                    <IonIcon icon={heart} />
                    <IonLabel>Mood</IonLabel>
                </IonTabButton>

                <IonTabButton tab="library" href="/main/library">
                    <IonIcon icon={musicalNotes} />
                    <IonLabel>Biblioteca</IonLabel>
                </IonTabButton>
            </IonTabBar>

            {/* Global Mini Player */}
            <MiniPlayer />
        </IonTabs>
    );
};

export default MainTabs;
