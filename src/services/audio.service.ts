export interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    coverUrl?: string;
    audioUrl: string;
    duration?: number;
}

export interface EQSettings {
    bass: number;
    mid: number;
    treble: number;
    preset: string;
}

class AudioService {
    private audioContext: AudioContext | null = null;
    private audioElement: HTMLAudioElement | null = null;
    private sourceNode: MediaElementAudioSourceNode | null = null;
    private isAudioGraphSetup: boolean = false;

    private bassFilter: BiquadFilterNode | null = null;
    private midFilter: BiquadFilterNode | null = null;
    private trebleFilter: BiquadFilterNode | null = null;

    private currentSong: Song | null = null;
    private isPlaying: boolean = false;

    private presets = {
        flat: { bass: 0, mid: 0, treble: 0 },
        bassBoost: { bass: 8, mid: 0, treble: -2 },
        pop: { bass: 2, mid: 4, treble: 2 },
        rock: { bass: 4, mid: -2, treble: 4 },
        vocal: { bass: -2, mid: 6, treble: 2 }
    };

    constructor() {
        this.initialize();
    }

    private initialize() {
        try {
            console.log('🎧 Initializing audio system...');

            // Create the audio element first
            this.audioElement = new Audio();
            this.audioElement.volume = 1.0;

            // CRITICAL: Setup Web Audio API IMMEDIATELY, before any playback
            // This prevents the "already playing" problem
            this.setupAudioGraphImmediately();

            // Add event listeners for debugging
            this.audioElement.addEventListener('loadstart', () => console.log('📥 Loading audio...'));
            this.audioElement.addEventListener('canplay', () => console.log('✅ Audio ready to play'));
            this.audioElement.addEventListener('playing', () => console.log('▶️ Audio playing'));
            this.audioElement.addEventListener('error', (e) => console.error('❌ Audio error:', e));

            console.log('✅ Audio system initialized');
        } catch (error) {
            console.error('❌ Audio element init failed:', error);
        }
    }

    private setupAudioGraphImmediately() {
        // Setup IMMEDIATELY so EQ is always available
        if (!this.audioElement) {
            console.error('❌ No audio element');
            return;
        }

        try {
            console.log('🔧 Setting up Web Audio API (immediate)...');

            // Create AudioContext
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // CRITICAL: Create source BEFORE any playback starts
            this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);

            // Create EQ filters
            this.bassFilter = this.audioContext.createBiquadFilter();
            this.bassFilter.type = 'lowshelf';
            this.bassFilter.frequency.value = 200;
            this.bassFilter.gain.value = 0;

            this.midFilter = this.audioContext.createBiquadFilter();
            this.midFilter.type = 'peaking';
            this.midFilter.frequency.value = 1000;
            this.midFilter.Q.value = 1;
            this.midFilter.gain.value = 0;

            this.trebleFilter = this.audioContext.createBiquadFilter();
            this.trebleFilter.type = 'highshelf';
            this.trebleFilter.frequency.value = 3000;
            this.trebleFilter.gain.value = 0;

            // Connect the graph
            this.sourceNode
                .connect(this.bassFilter)
                .connect(this.midFilter)
                .connect(this.trebleFilter)
                .connect(this.audioContext.destination);

            this.isAudioGraphSetup = true;
            console.log('✅ Web Audio API ready - EQ available from the start');
        } catch (error) {
            console.error('❌ Web Audio API setup failed - app will work but without EQ:', error);
            this.isAudioGraphSetup = false;
        }
    }

    async play(song: Song) {
        if (!this.audioElement) {
            console.error('❌ Audio element not initialized');
            return;
        }

        try {
            console.log('🎵 Playing:', song.title);

            // Resume audio context if it exists and is suspended
            if (this.audioContext?.state === 'suspended') {
                try {
                    await this.audioContext.resume();
                    console.log('▶️ Audio context resumed');
                } catch (err) {
                    console.warn('⚠️ Could not resume audio context:', err);
                }
            }

            // Set the song
            this.currentSong = song;
            this.audioElement.src = song.audioUrl;

            // Play the audio - NO Web Audio API setup here!
            await this.audioElement.play();
            this.isPlaying = true;

            console.log('✅ Audio playing!');
        } catch (error) {
            console.error('❌ Play error:', error);
            this.isPlaying = false;
            throw error;
        }
    }

    pause() {
        try {
            if (!this.audioElement) return;
            this.audioElement.pause();
            this.isPlaying = false;
        } catch (error) {
            console.error('❌ Pause error:', error);
        }
    }

    resume() {
        try {
            if (!this.audioElement) return;
            this.audioElement.play();
            this.isPlaying = true;
        } catch (error) {
            console.error('❌ Resume error:', error);
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    seek(position: number) {
        try {
            if (!this.audioElement) return;
            const duration = this.audioElement.duration;
            if (duration && !isNaN(duration)) {
                this.audioElement.currentTime = position * duration;
            }
        } catch (error) {
            console.error('❌ Seek error:', error);
        }
    }

    getCurrentTime(): number {
        try {
            return this.audioElement?.currentTime || 0;
        } catch {
            return 0;
        }
    }

    getDuration(): number {
        try {
            return this.audioElement?.duration || 0;
        } catch {
            return 0;
        }
    }

    getProgress(): number {
        try {
            const duration = this.getDuration();
            if (!duration || isNaN(duration)) return 0;
            const current = this.getCurrentTime();
            if (isNaN(current)) return 0;
            return current / duration;
        } catch {
            return 0;
        }
    }

    setEQ(settings: Partial<EQSettings>) {
        // If Web Audio API is not available, silently fail
        if (!this.isAudioGraphSetup || !this.bassFilter || !this.midFilter || !this.trebleFilter) {
            console.warn('⚠️ EQ not available (Web Audio API failed at startup)');
            return;
        }

        try {
            if (settings.bass !== undefined && !isNaN(settings.bass)) {
                this.bassFilter.gain.value = settings.bass;
                console.log('🎚️ Bass:', settings.bass);
            }
            if (settings.mid !== undefined && !isNaN(settings.mid)) {
                this.midFilter.gain.value = settings.mid;
                console.log('🎚️ Mid:', settings.mid);
            }
            if (settings.treble !== undefined && !isNaN(settings.treble)) {
                this.trebleFilter.gain.value = settings.treble;
                console.log('🎚️ Treble:', settings.treble);
            }
        } catch (error) {
            console.error('❌ Error setting EQ:', error);
        }
    }

    applyPreset(presetName: keyof typeof this.presets) {
        const preset = this.presets[presetName];
        if (preset) {
            this.setEQ(preset);
        }
    }

    getCurrentSong(): Song | null {
        return this.currentSong;
    }

    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    setVolume(volume: number) {
        try {
            if (!this.audioElement) {
                console.warn('⚠️ Audio element not ready for volume change');
                return;
            }
            const clampedVolume = Math.max(0, Math.min(1, volume));
            console.log('🔊 Setting volume to:', clampedVolume);
            this.audioElement.volume = clampedVolume;
        } catch (error) {
            console.error('❌ Error setting volume:', error);
        }
    }
}

export const audioService = new AudioService();
