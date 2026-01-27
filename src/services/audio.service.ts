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
    midQ?: number;
    preset: string;
}

export interface PlayResult {
    ok: boolean;
    reason?: 'ABORTED' | 'STALE_PLAY_ATTEMPT' | 'NO_SOURCE' | 'INVALID_URL' | 'LOAD_ERROR' | 'UNKNOWN';
    message?: string;
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
    private playAttemptId: number = 0;

    private presets = {
        flat: { bass: 0, mid: 0, treble: 0, midQ: 1 },
        bassBoost: { bass: 8, mid: 0, treble: -2, midQ: 1 },
        pop: { bass: 2, mid: 4, treble: 2, midQ: 1 },
        rock: { bass: 4, mid: -2, treble: 4, midQ: 1 },
        vocal: { bass: -2, mid: 6, treble: 2, midQ: 1 },
        karaoke: { bass: 4, mid: -40, treble: 4, midQ: 0.1 } 
    };

    constructor() {
        this.initialize();
    }

    private initialize() {
        try {
            console.log('🎧 Initializing audio system...');
            this.audioElement = new Audio();
            this.audioElement.volume = 1.0;
            this.audioElement.preload = 'auto';
            this.setupAudioGraphImmediately();
        } catch (error) {
            console.error('❌ Audio element init failed:', error);
        }
    }

    private setupAudioGraphImmediately() {
        if (this.isAudioGraphSetup) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.audioContext = new AudioContextClass();
            
            if (!this.audioElement) return;
            
            this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);

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

            this.sourceNode
                .connect(this.bassFilter)
                .connect(this.midFilter)
                .connect(this.trebleFilter)
                .connect(this.audioContext.destination);

            this.isAudioGraphSetup = true;
            console.log('✅ Web Audio API ready - EQ available');
        } catch (error) {
            console.error('❌ Web Audio API setup failed:', error);
        }
    }

    private isValidAudioUrl(url: string | undefined | null): boolean {
        if (!url || typeof url !== 'string') return false;
        const trimmed = url.trim();
        if (!trimmed) return false;
        return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:');
    }

    load(url: string): boolean {
        if (!this.audioElement) return false;
        if (!this.isValidAudioUrl(url)) return false;

        try {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement.src = url;
            this.audioElement.load();
            return true;
        } catch (error) {
            console.error('❌ Error loading audio:', error);
            return false;
        }
    }

    async play(song: Song): Promise<PlayResult> {
        if (!this.audioElement) return { ok: false, reason: 'LOAD_ERROR' };

        const thisAttemptId = ++this.playAttemptId;

        try {
            console.log('🎵 Playing:', song.title);

            if (!this.isValidAudioUrl(song.audioUrl)) {
                return { ok: false, reason: 'INVALID_URL' };
            }

            if (this.audioContext?.state === 'suspended') {
                await this.audioContext.resume().catch(console.warn);
            }

            if (this.currentSong?.id !== song.id || !this.audioElement.src) {
                if (!this.load(song.audioUrl)) return { ok: false, reason: 'LOAD_ERROR' };
            }

            if (thisAttemptId !== this.playAttemptId) return { ok: false, reason: 'STALE_PLAY_ATTEMPT' };

            this.currentSong = song;
            
            try {
                await this.audioElement.play();
                this.isPlaying = true;
                return { ok: true };
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return { ok: false, reason: 'ABORTED' };
                }
                throw err;
            }
        } catch (error) {
            console.error('❌ Play error:', error);
            this.isPlaying = false;
            return { ok: false, reason: 'UNKNOWN', message: String(error) };
        }
    }

    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.isPlaying = false;
        }
    }

    async resume(): Promise<PlayResult> {
        if (!this.audioElement) return { ok: false, reason: 'LOAD_ERROR' };
        try {
            if (this.audioContext?.state === 'suspended') await this.audioContext.resume();
            await this.audioElement.play();
            this.isPlaying = true;
            return { ok: true };
        } catch (error) {
            return { ok: false, reason: 'UNKNOWN', message: String(error) };
        }
    }

    async togglePlayPause(): Promise<PlayResult> {
        return this.isPlaying ? (this.pause(), { ok: true }) : this.resume();
    }

    seek(position: number) {
        if (this.audioElement && this.audioElement.duration) {
            this.audioElement.currentTime = position * this.audioElement.duration;
        }
    }

    getDuration(): number {
        return this.audioElement?.duration || 0;
    }

    getCurrentTime(): number {
        return this.audioElement?.currentTime || 0;
    }

    getProgress(): number {
        const d = this.getDuration();
        return d > 0 ? (this.getCurrentTime() / d) : 0;
    }

    setEQ(settings: Partial<EQSettings>) {
        if (!this.isAudioGraphSetup || !this.bassFilter || !this.midFilter || !this.trebleFilter) return;

        try {
            if (settings.bass !== undefined && !isNaN(settings.bass)) this.bassFilter.gain.value = settings.bass;
            if (settings.mid !== undefined && !isNaN(settings.mid)) this.midFilter.gain.value = settings.mid;
            if (settings.treble !== undefined && !isNaN(settings.treble)) this.trebleFilter.gain.value = settings.treble;
            
            // Dynamic Q factor check
            const qVal = settings.midQ ?? 1;
            if (this.midFilter.Q.value !== qVal) {
                this.midFilter.Q.value = qVal;
                console.log('🎚️ Mid Q:', qVal);
            }
        } catch (e) {
            console.error(e);
        }
    }

    applyPreset(presetName: keyof typeof this.presets) {
        const preset = this.presets[presetName];
        if (preset) this.setEQ(preset);
    }

    getCurrentSong() { return this.currentSong; }
    getIsPlaying() { return this.isPlaying; }
    getAudioElement() { return this.audioElement; }
    
    setVolume(vol: number) {
        if (this.audioElement) this.audioElement.volume = Math.max(0, Math.min(1, vol));
    }
}

export const audioService = new AudioService();
