// Mock music data with sample audio URLs
// In production, replace these with your actual music files or Spotify API backend

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration: string;
    durationMs: number;
    previewUrl: string;
    explicit?: boolean;
}

// Sample audio URL (royalty-free music for testing)
const SAMPLE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// Mock album data with tracks
export const mockAlbums: { [key: string]: any } = {
    'astroworld': {
        album: {
            id: 'astroworld',
            name: 'ASTROWORLD',
            artist: 'Travis Scott',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png',
            year: '2018',
            totalTracks: 17
        },
        tracks: [
            { id: '1', number: 1, title: 'STARGAZING', artist: 'Travis Scott', duration: '4:31', durationMs: 271000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '2', number: 2, title: 'CAROUSEL', artist: 'Travis Scott', duration: '3:00', durationMs: 180000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '3', number: 3, title: 'SICKO MODE', artist: 'Travis Scott', duration: '5:13', durationMs: 313000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '4', number: 4, title: 'R.I.P. SCREW', artist: 'Travis Scott', duration: '3:06', durationMs: 186000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '5', number: 5, title: 'STOP TRYING TO BE GOD', artist: 'Travis Scott', duration: '5:38', durationMs: 338000, previewUrl: SAMPLE_AUDIO },
        ]
    },
    'utopia': {
        album: {
            id: 'utopia',
            name: 'UTOPIA',
            artist: 'Travis Scott',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png',
            year: '2023',
            totalTracks: 19
        },
        tracks: [
            { id: '6', number: 1, title: 'HYAENA', artist: 'Travis Scott', duration: '3:42', durationMs: 222000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '7', number: 2, title: 'THANK GOD', artist: 'Travis Scott', duration: '3:04', durationMs: 184000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '8', number: 3, title: 'MODERN JAM', artist: 'Travis Scott', duration: '4:15', durationMs: 255000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '9', number: 4, title: 'MY EYES', artist: 'Travis Scott', duration: '4:11', durationMs: 251000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '10', number: 5, title: 'FE!N', artist: 'Travis Scott', duration: '3:12', durationMs: 192000, previewUrl: SAMPLE_AUDIO, explicit: true },
        ]
    },
    'un-verano-sin-ti': {
        album: {
            id: 'un-verano-sin-ti',
            name: 'Un Verano Sin Ti',
            artist: 'Bad Bunny',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png',
            year: '2022',
            totalTracks: 23
        },
        tracks: [
            { id: '11', number: 1, title: 'Moscow Mule', artist: 'Bad Bunny', duration: '4:04', durationMs: 244000, previewUrl: SAMPLE_AUDIO },
            { id: '12', number: 2, title: 'Después de la Playa', artist: 'Bad Bunny', duration: '3:26', durationMs: 206000, previewUrl: SAMPLE_AUDIO },
            { id: '13', number: 3, title: 'Me Porto Bonito', artist: 'Bad Bunny', duration: '2:58', durationMs: 178000, previewUrl: SAMPLE_AUDIO },
            { id: '14', number: 4, title: 'Tití Me Preguntó', artist: 'Bad Bunny', duration: '4:03', durationMs: 243000, previewUrl: SAMPLE_AUDIO },
            { id: '15', number: 5, title: 'Un Ratito', artist: 'Bad Bunny', duration: '3:15', durationMs: 195000, previewUrl: SAMPLE_AUDIO },
        ]
    },
    'manana-sera-bonito': {
        album: {
            id: 'manana-sera-bonito',
            name: 'Mañana Será Bonito',
            artist: 'Karol G',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png',
            year: '2023',
            totalTracks: 17
        },
        tracks: [
            { id: '16', number: 1, title: 'Mientras Me Curo del Cora', artist: 'Karol G', duration: '3:15', durationMs: 195000, previewUrl: SAMPLE_AUDIO },
            { id: '17', number: 2, title: 'Qlona', artist: 'Karol G', duration: '2:48', durationMs: 168000, previewUrl: SAMPLE_AUDIO },
            { id: '18', number: 3, title: 'Carolina', artist: 'Karol G', duration: '3:22', durationMs: 202000, previewUrl: SAMPLE_AUDIO },
            { id: '19', number: 4, title: 'X Si Volvemos', artist: 'Karol G', duration: '3:41', durationMs: 221000, previewUrl: SAMPLE_AUDIO },
            { id: '20', number: 5, title: 'Provenza', artist: 'Karol G', duration: '3:32', durationMs: 212000, previewUrl: SAMPLE_AUDIO },
        ]
    },
    'genesis': {
        album: {
            id: 'genesis',
            name: 'Génesis',
            artist: 'Peso Pluma',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png',
            year: '2023',
            totalTracks: 14
        },
        tracks: [
            { id: '21', number: 1, title: 'Génesis', artist: 'Peso Pluma', duration: '2:45', durationMs: 165000, previewUrl: SAMPLE_AUDIO },
            { id: '22', number: 2, title: 'Lady Gaga', artist: 'Peso Pluma', duration: '3:12', durationMs: 192000, previewUrl: SAMPLE_AUDIO },
            { id: '23', number: 3, title: 'PRC', artist: 'Peso Pluma', duration: '2:58', durationMs: 178000, previewUrl: SAMPLE_AUDIO, explicit: true },
            { id: '24', number: 4, title: 'Ella Baila Sola', artist: 'Peso Pluma', duration: '2:42', durationMs: 162000, previewUrl: SAMPLE_AUDIO },
            { id: '25', number: 5, title: 'Rubicon', artist: 'Peso Pluma', duration: '3:05', durationMs: 185000, previewUrl: SAMPLE_AUDIO },
        ]
    },
    'feliz-cumpleanos-ferxxo': {
        album: {
            id: 'feliz-cumpleanos-ferxxo',
            name: 'FELIZ CUMPLEAÑOS FERXXO',
            artist: 'Feid',
            cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png',
            year: '2022',
            totalTracks: 14
        },
        tracks: [
            { id: '26', number: 1, title: 'FERXXO 151', artist: 'Feid', duration: '2:48', durationMs: 168000, previewUrl: SAMPLE_AUDIO },
            { id: '27', number: 2, title: 'NORMAL', artist: 'Feid', duration: '3:15', durationMs: 195000, previewUrl: SAMPLE_AUDIO },
            { id: '28', number: 3, title: 'PORFA', artist: 'Feid', duration: '2:52', durationMs: 172000, previewUrl: SAMPLE_AUDIO },
            { id: '29', number: 4, title: 'CLASSY 101', artist: 'Feid', duration: '3:08', durationMs: 188000, previewUrl: SAMPLE_AUDIO },
            { id: '30', number: 5, title: 'VACAXIONES', artist: 'Feid', duration: '3:18', durationMs: 198000, previewUrl: SAMPLE_AUDIO },
        ]
    }
};

// Mock mood playlists
export const mockMoodPlaylists: { [key: string]: Track[] } = {
    'feliz': [
        { id: '13', title: 'Me Porto Bonito', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '2:58', durationMs: 178000, previewUrl: SAMPLE_AUDIO },
        { id: '14', title: 'Tití Me Preguntó', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '4:03', durationMs: 243000, previewUrl: SAMPLE_AUDIO },
        { id: '20', title: 'Provenza', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:32', durationMs: 212000, previewUrl: SAMPLE_AUDIO },
        { id: '27', title: 'NORMAL', artist: 'Feid', album: 'FELIZ CUMPLEAÑOS FERXXO', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png', duration: '3:15', durationMs: 195000, previewUrl: SAMPLE_AUDIO },
        { id: '24', title: 'Ella Baila Sola', artist: 'Peso Pluma', album: 'Génesis', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png', duration: '2:42', durationMs: 162000, previewUrl: SAMPLE_AUDIO },
    ],
    'triste': [
        { id: '12', title: 'Después de la Playa', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '3:26', durationMs: 206000, previewUrl: SAMPLE_AUDIO },
        { id: '19', title: 'X Si Volvemos', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:41', durationMs: 221000, previewUrl: SAMPLE_AUDIO },
        { id: '16', title: 'Mientras Me Curo del Cora', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:15', durationMs: 195000, previewUrl: SAMPLE_AUDIO },
        { id: '28', title: 'PORFA', artist: 'Feid', album: 'FELIZ CUMPLEAÑOS FERXXO', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png', duration: '2:52', durationMs: 172000, previewUrl: SAMPLE_AUDIO },
        { id: '5', title: 'STOP TRYING TO BE GOD', artist: 'Travis Scott', album: 'ASTROWORLD', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png', duration: '5:38', durationMs: 338000, previewUrl: SAMPLE_AUDIO },
    ],
    'energetico': [
        { id: '3', title: 'SICKO MODE', artist: 'Travis Scott', album: 'ASTROWORLD', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png', duration: '5:13', durationMs: 313000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '10', title: 'FE!N', artist: 'Travis Scott', album: 'UTOPIA', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png', duration: '3:12', durationMs: 192000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '8', title: 'MODERN JAM', artist: 'Travis Scott', album: 'UTOPIA', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png', duration: '4:15', durationMs: 255000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '23', title: 'PRC', artist: 'Peso Pluma', album: 'Génesis', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png', duration: '2:58', durationMs: 178000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '1', title: 'STARGAZING', artist: 'Travis Scott', album: 'ASTROWORLD', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png', duration: '4:31', durationMs: 271000, previewUrl: SAMPLE_AUDIO, explicit: true },
    ],
    'relajado': [
        { id: '11', title: 'Moscow Mule', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '4:04', durationMs: 244000, previewUrl: SAMPLE_AUDIO },
        { id: '18', title: 'Carolina', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:22', durationMs: 202000, previewUrl: SAMPLE_AUDIO },
        { id: '25', title: 'Rubicon', artist: 'Peso Pluma', album: 'Génesis', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png', duration: '3:05', durationMs: 185000, previewUrl: SAMPLE_AUDIO },
        { id: '29', title: 'CLASSY 101', artist: 'Feid', album: 'FELIZ CUMPLEAÑOS FERXXO', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png', duration: '3:08', durationMs: 188000, previewUrl: SAMPLE_AUDIO },
        { id: '7', title: 'THANK GOD', artist: 'Travis Scott', album: 'UTOPIA', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png', duration: '3:04', durationMs: 184000, previewUrl: SAMPLE_AUDIO, explicit: true },
    ],
    'fiesta': [
        { id: '30', title: 'VACAXIONES', artist: 'Feid', album: 'FELIZ CUMPLEAÑOS FERXXO', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png', duration: '3:18', durationMs: 198000, previewUrl: SAMPLE_AUDIO },
        { id: '22', title: 'Lady Gaga', artist: 'Peso Pluma', album: 'Génesis', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png', duration: '3:12', durationMs: 192000, previewUrl: SAMPLE_AUDIO },
        { id: '2', title: 'CAROUSEL', artist: 'Travis Scott', album: 'ASTROWORLD', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png', duration: '3:00', durationMs: 180000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '15', title: 'Un Ratito', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '3:15', durationMs: 195000, previewUrl: SAMPLE_AUDIO },
        { id: '17', title: 'Qlona', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '2:48', durationMs: 168000, previewUrl: SAMPLE_AUDIO },
    ],
    'concentracion': [
        { id: '6', title: 'HYAENA', artist: 'Travis Scott', album: 'UTOPIA', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png', duration: '3:42', durationMs: 222000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '9', title: 'MY EYES', artist: 'Travis Scott', album: 'UTOPIA', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png', duration: '4:11', durationMs: 251000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '21', title: 'Génesis', artist: 'Peso Pluma', album: 'Génesis', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png', duration: '2:45', durationMs: 165000, previewUrl: SAMPLE_AUDIO },
        { id: '26', title: 'FERXXO 151', artist: 'Feid', album: 'FELIZ CUMPLEAÑOS FERXXO', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png', duration: '2:48', durationMs: 168000, previewUrl: SAMPLE_AUDIO },
        { id: '4', title: 'R.I.P. SCREW', artist: 'Travis Scott', album: 'ASTROWORLD', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/astroworld_cover_1767971071912.png', duration: '3:06', durationMs: 186000, previewUrl: SAMPLE_AUDIO, explicit: true },
    ],
    'romantico': [
        { id: '17', title: 'Qlona', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '2:48', durationMs: 168000, previewUrl: SAMPLE_AUDIO },
        { id: '28', title: 'PORFA', artist: 'Feid', album: 'FELIZ CUMPLEAÑOS FERXXO', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/feid_cover_1767971309566.png', duration: '2:52', durationMs: 172000, previewUrl: SAMPLE_AUDIO },
        { id: '19', title: 'X Si Volvemos', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:41', durationMs: 221000, previewUrl: SAMPLE_AUDIO },
        { id: '12', title: 'Después de la Playa', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '3:26', durationMs: 206000, previewUrl: SAMPLE_AUDIO },
        { id: '18', title: 'Carolina', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:22', durationMs: 202000, previewUrl: SAMPLE_AUDIO },
    ],
    'chill': [
        { id: '11', title: 'Moscow Mule', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '4:04', durationMs: 244000, previewUrl: SAMPLE_AUDIO },
        { id: '12', title: 'Después de la Playa', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/bad_bunny_cover_1767971162086.png', duration: '3:26', durationMs: 206000, previewUrl: SAMPLE_AUDIO },
        { id: '25', title: 'Rubicon', artist: 'Peso Pluma', album: 'Génesis', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/peso_pluma_cover_1767971277893.png', duration: '3:05', durationMs: 185000, previewUrl: SAMPLE_AUDIO },
        { id: '7', title: 'THANK GOD', artist: 'Travis Scott', album: 'UTOPIA', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/utopia_cover_1767971115878.png', duration: '3:04', durationMs: 184000, previewUrl: SAMPLE_AUDIO, explicit: true },
        { id: '20', title: 'Provenza', artist: 'Karol G', album: 'Mañana Será Bonito', cover: 'C:/Users/User/.gemini/antigravity/brain/c4f0242e-0d7a-4372-8405-ce94974537c9/karol_g_cover_1767971242879.png', duration: '3:32', durationMs: 212000, previewUrl: SAMPLE_AUDIO },
    ]
};
