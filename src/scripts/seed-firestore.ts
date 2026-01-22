/**
 * Seed Data for Firestore - EchoBeat
 * 
 * Script para poblar Firestore con datos de prueba
 * Ejecutar: npm run seed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAsKf8UOV9t5_Ctkzi4vnb5ktNy1SKJ3os",
    authDomain: "echo-beat-77c21.firebaseapp.com",
    projectId: "echo-beat-77c21",
    storageBucket: "echo-beat-77c21.firebasestorage.app",
    messagingSenderId: "367705500486",
    appId: "1:367705500486:web:ac0d5f3d6b312072d41347",
    measurementId: "G-QR9MZGRSB4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Datos de prueba
const SAMPLE_SONGS = [
    {
        title: "Sicko Mode",
        artist: "Travis Scott",
        album: "ASTROWORLD",
        duration: 312,
        genre: "Hip Hop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b2731aafa29c9da37c9c82e5cb09",
        audioUrl: "https://example.com/sicko-mode.mp3", // Demo URL
        plays: 15420,
        likes: 823,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: 200,
        genre: "Pop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        audioUrl: "https://example.com/blinding-lights.mp3",
        plays: 28900,
        likes: 1542,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "Bad Bunny - Tití Me Preguntó",
        artist: "Bad Bunny",
        album: "Un Verano Sin Ti",
        duration: 256,
        genre: "Reggaeton",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b273c6e604e1293d1bf2703c9c4e",
        audioUrl: "https://example.com/titi-me-pregunto.mp3",
        plays: 19800,
        likes: 956,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        duration: 233,
        genre: "Pop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        audioUrl: "https://example.com/shape-of-you.mp3",
        plays: 32100,
        likes: 1876,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: 203,
        genre: "Pop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
        audioUrl: "https://example.com/levitating.mp3",
        plays: 21500,
        likes: 1123,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "One Dance",
        artist: "Drake",
        album: "Views",
        duration: 173,
        genre: "Hip Hop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c",
        audioUrl: "https://example.com/one-dance.mp3",
        plays: 18900,
        likes: 892,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "As It Was",
        artist: "Harry Styles",
        album: "Harry's House",
        duration: 167,
        genre: "Pop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
        audioUrl: "https://example.com/as-it-was.mp3",
        plays: 26700,
        likes: 1345,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    },
    {
        title: "Peaches",
        artist: "Justin Bieber",
        album: "Justice",
        duration: 198,
        genre: "Pop",
        coverUrl: "https://i.scdn.co/image/ab67616d0000b2734e0362c225863f6ae2432651",
        audioUrl: "https://example.com/peaches.mp3",
        plays: 17200,
        likes: 734,
        isPublic: true,
        uploadedBy: "demo-user",
        uploadedByName: "Demo User"
    }
];

const SAMPLE_USERS = [
    {
        id: "demo-user",
        email: "demo@echobeat.com",
        displayName: "Demo User",
        avatarUrl: "https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff&size=200",
        bio: "Amante de la música 🎵",
        premium: false,
        favoriteGenres: ["Hip Hop", "Pop", "Reggaeton"],
        followingCount: 0,
        followersCount: 0
    }
];

async function seedFirestore() {
    console.log('🌱 Starting Firestore seed...\n');

    try {
        // 1. Crear usuarios
        console.log('📝 Creating users...');
        for (const user of SAMPLE_USERS) {
            const userRef = doc(db, 'users', user.id);
            await setDoc(userRef, {
                ...user,
                createdAt: Timestamp.now()
            });
            console.log(`✅ User created: ${user.displayName}`);
        }
        console.log('');

        // 2. Crear canciones
        console.log('🎵 Creating songs...');
        const songIds: string[] = [];
        for (const song of SAMPLE_SONGS) {
            const songRef = await addDoc(collection(db, 'songs'), {
                ...song,
                createdAt: Timestamp.now()
            });
            songIds.push(songRef.id);
            console.log(`✅ Song created: ${song.title} by ${song.artist}`);
        }
        console.log('');

        // 3. Crear playlists de ejemplo
        console.log('📂 Creating playlists...');
        const playlists = [
            {
                userId: "demo-user",
                name: "Mis Favoritas 🎵",
                description: "Las mejores canciones del momento",
                isPublic: true,
                songs: [
                    { songId: songIds[0], addedAt: Timestamp.now(), position: 0 },
                    { songId: songIds[1], addedAt: Timestamp.now(), position: 1 },
                    { songId: songIds[2], addedAt: Timestamp.now(), position: 2 }
                ],
                songCount: 3,
                followers: 0
            },
            {
                userId: "demo-user",
                name: "Workout Mix 💪",
                description: "Energía para entrenar",
                isPublic: true,
                songs: [
                    { songId: songIds[3], addedAt: Timestamp.now(), position: 0 },
                    { songId: songIds[4], addedAt: Timestamp.now(), position: 1 }
                ],
                songCount: 2,
                followers: 0
            },
            {
                userId: "demo-user",
                name: "Chill Vibes 🌙",
                description: "Para relajarse",
                isPublic: true,
                songs: [
                    { songId: songIds[5], addedAt: Timestamp.now(), position: 0 },
                    { songId: songIds[6], addedAt: Timestamp.now(), position: 1 },
                    { songId: songIds[7], addedAt: Timestamp.now(), position: 2 }
                ],
                songCount: 3,
                followers: 0
            }
        ];

        for (const playlist of playlists) {
            const playlistRef = await addDoc(collection(db, 'playlists'), {
                ...playlist,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            console.log(`✅ Playlist created: ${playlist.name}`);
        }
        console.log('');

        // 4. Agregar favoritos de ejemplo
        console.log('❤️ Creating favorites...');
        const favorites = [songIds[0], songIds[1], songIds[4]];
        for (const songId of favorites) {
            const song = SAMPLE_SONGS[songIds.indexOf(songId)];
            const favoriteRef = doc(db, `users/demo-user/favorites`, songId);
            await setDoc(favoriteRef, {
                songId,
                songTitle: song.title,
                songArtist: song.artist,
                songCoverUrl: song.coverUrl,
                addedAt: Timestamp.now()
            });
            console.log(`✅ Favorite added: ${song.title}`);
        }
        console.log('');

        console.log('🎉 Seed completed successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - ${SAMPLE_USERS.length} users created`);
        console.log(`   - ${SAMPLE_SONGS.length} songs created`);
        console.log(`   - ${playlists.length} playlists created`);
        console.log(`   - ${favorites.length} favorites added`);
        console.log(`\n✅ Firestore is now populated with sample data!`);
        console.log(`🔗 View data: https://console.firebase.google.com/project/echo-beat-77c21/firestore/data`);

    } catch (error) {
        console.error('❌ Error seeding Firestore:', error);
        throw error;
    }
}

// Ejecutar seed
seedFirestore()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seed failed:', error);
        process.exit(1);
    });
