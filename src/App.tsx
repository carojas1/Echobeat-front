import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import MainTabs from './pages/MainTabs';
import AdminDashboard from './pages/admin/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { SongsProvider } from './contexts/SongsContext';
import { GlobalMiniPlayer } from './components/GlobalMiniPlayer';
import { GlobalNowPlaying } from './components/GlobalNowPlaying';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// 🔥 AUTO-CLEANUP: Ejecutar al cargar la app
const cleanupMockTokens = () => {
  const token = localStorage.getItem("token");
  
  if (token && token.startsWith("mock-token-")) {
    console.warn("🧹 Mock token detectado - limpiando automáticamente...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("is_demo_mode");
    console.log("✅ Mock tokens eliminados");
  }
};

// Ejecutar limpieza inmediatamente
cleanupMockTokens();

const App: React.FC = () => {
  // Limpiar mock tokens al montar el componente
  useEffect(() => {
    cleanupMockTokens();
  }, []);

  return (
  <ErrorBoundary>
    <IonApp>
      <ThemeProvider>
        <SongsProvider>
          <PlayerProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route path="/main">
                <MainTabs />
              </Route>
              <Route exact path="/admin">
                <AdminDashboard />
              </Route>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </IonRouterOutlet>

            {/* Global Player - Fixed with mounted checks in PlayerContext */}
            <GlobalMiniPlayer />
            <GlobalNowPlaying />
          </IonReactRouter>
          </PlayerProvider>
        </SongsProvider>
      </ThemeProvider>
    </IonApp>
  </ErrorBoundary>
  );
};

export default App;
