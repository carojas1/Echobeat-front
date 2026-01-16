// Spotify API Configuration
// IMPORTANTE: Obtén estas credenciales desde Spotify Developer Dashboard
// https://developer.spotify.com/dashboard

export const spotifyConfig = {
    clientId: "TU_CLIENT_ID", // Reemplaza con tu Client ID de Spotify
    redirectUri: "http://localhost:5173/callback",
    scopes: [
        "streaming",
        "user-read-email",
        "user-read-private",
        "user-library-read",
        "user-library-modify",
        "user-read-playback-state",
        "user-modify-playback-state"
    ]
};

// IDs de álbumes de Spotify (estos son los IDs reales de Spotify)
export const albumIds = {
    astroworld: "41GuZcammIkupMPKH2OJ6I",
    utopia: "18NOKLkZETa4sWwLMIm0UZ",
    "un-verano-sin-ti": "3RQQmkQEvNCY4prGKE6oc5",
    "manana-sera-bonito": "5ILMHfERRyp5RGqjaQTOAr",
    "genesis": "5cX1cRBJdEQZNJMbMcqU5F",
    "feliz-cumpleanos-ferxxo": "5G0l6uBpBWJXWMWy4cHvPK"
};

export default spotifyConfig;
