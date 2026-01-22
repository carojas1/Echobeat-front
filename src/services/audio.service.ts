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

    // ✅ Play attempt counter to cancel stale plays
    private playAttemptId: number = 0;

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
            this.audioElement.preload = 'auto'; // ✅ Preload for faster playback

            // Setup Web Audio API IMMEDIATELY
            this.setupAudioGraphImmediately();

            // Add event listeners for debugging
            this.audioElement.addEventListener('loadstart', () => console.log('📥 Loading audio...'));
            this.audioElement.addEventListener('canplay', () => console.log('✅ Audio ready to play'));
            this.audioElement.addEventListener('playing', () => console.log('▶️ Audio playing'));
            this.audioElement.addEventListener('error', () => {
                this.logAudioError('Audio error event');
            });

            console.log('✅ Audio system initialized');
        } catch (error) {
            console.error('❌ Audio element init failed:', error);
        }
    }

    // ✅ Diagnostic helper for NotSupportedError
    private logAudioError(context: string) {
        if (!this.audioElement) {
            console.error(`❌ ${context}: No audio element`);
            return;
        }

        const audio = this.audioElement;
        const mediaError = audio.error;

        console.group(`❌ ${context}`);
        console.log('audio.src:', audio.src);
        console.log('audio.currentSrc:', audio.currentSrc);
        console.log('canPlayType("audio/mpeg"):', audio.canPlayType('audio/mpeg'));
        console.log('canPlayType("audio/wav"):', audio.canPlayType('audio/wav'));
        console.log('canPlayType("audio/ogg"):', audio.canPlayType('audio/ogg'));
        console.log('readyState:', audio.readyState, this.getReadyStateLabel(audio.readyState));
        console.log('networkState:', audio.networkState, this.getNetworkStateLabel(audio.networkState));

        if (mediaError) {
            console.log('error.code:', mediaError.code, this.getMediaErrorLabel(mediaError.code));
            console.log('error.message:', mediaError.message || '(no message)');
        }

        if (audio.networkState === 0 || audio.readyState === 0) {
            console.warn('⚠️ URL no es audio válido, responde con HTML/401/CORS, o no existe');
        }
        console.groupEnd();
    }

    private getReadyStateLabel(state: number): string {
        const labels: Record<number, string> = {
            0: 'HAVE_NOTHING',
            1: 'HAVE_METADATA',
            2: 'HAVE_CURRENT_DATA',
            3: 'HAVE_FUTURE_DATA',
            4: 'HAVE_ENOUGH_DATA'
        };
        return labels[state] || 'UNKNOWN';
    }

    private getNetworkStateLabel(state: number): string {
        const labels: Record<number, string> = {
            0: 'NETWORK_EMPTY',
            1: 'NETWORK_IDLE',
            2: 'NETWORK_LOADING',
            3: 'NETWORK_NO_SOURCE'
        };
        return labels[state] || 'UNKNOWN';
    }

    private getMediaErrorLabel(code: number): string {
        const labels: Record<number, string> = {
            1: 'MEDIA_ERR_ABORTED',
            2: 'MEDIA_ERR_NETWORK',
            3: 'MEDIA_ERR_DECODE',
            4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
        };
        return labels[code] || 'UNKNOWN';
    }

    private setupAudioGraphImmediately() {
        if (!this.audioElement) {
            console.error('❌ No audio element');
            return;
        }

        try {
            console.log('🔧 Setting up Web Audio API (immediate)...');

            this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

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

    // ✅ Validate URL before loading
    private isValidAudioUrl(url: string | undefined | null): boolean {
        if (!url || typeof url !== 'string') return false;
        const trimmed = url.trim();
        if (!trimmed) return false;
        // Must start with http/https or be a blob/data URL
        return trimmed.startsWith('http://') ||
               trimmed.startsWith('https://') ||
               trimmed.startsWith('blob:') ||
               trimmed.startsWith('data:');
    }

    // ✅ Load audio source (pause, reset, set src, load)
    load(url: string): boolean {
        if (!this.audioElement) {
            console.error('❌ No audio element for load');
            return false;
        }

        if (!this.isValidAudioUrl(url)) {
            console.error('❌ Invalid audio URL:', url);
            return false;
        }

        try {
            // Pause current playback
            this.audioElement.pause();
            // Reset time
            this.audioElement.currentTime = 0;
            // Set new source
            this.audioElement.src = url;
            // Force load
            this.audioElement.load();
            return true;
        } catch (error) {
            console.error('❌ Error loading audio:', error);
            return false;
        }
    }

    async play(song: Song): Promise<PlayResult> {
        if (!this.audioElement) {
            console.error('❌ Audio element not initialized');
            return { ok: false, reason: 'LOAD_ERROR', message: 'Audio element not initialized' };
        }

        // ✅ Increment play attempt ID to cancel previous attempts
        const thisAttemptId = ++this.playAttemptId;

        try {
            console.log('🎵 Playing:', song.title, '| URL:', song.audioUrl);

            // ✅ Validate URL first
            if (!this.isValidAudioUrl(song.audioUrl)) {
                console.error('❌ Invalid audio URL:', song.audioUrl);
                return { ok: false, reason: 'INVALID_URL', message: `URL inválida: ${song.audioUrl}` };
            }

            // Resume audio context if suspended
            if (this.audioContext?.state === 'suspended') {
                try {
                    await this.audioContext.resume();
                    console.log('▶️ Audio context resumed');
                } catch (err) {
                    console.warn('⚠️ Could not resume audio context:', err);
                }
            }

            // ✅ Check if this attempt is still valid
            if (thisAttemptId !== this.playAttemptId) {
                console.log('⏭️ Stale play attempt canceled (new song selected)');
                return { ok: false, reason: 'STALE_PLAY_ATTEMPT', message: 'Canceled by newer play request' };
            }

            // Set the song
            this.currentSong = song;

            // ✅ Load the audio properly
            const loaded = this.load(song.audioUrl);
            if (!loaded) {
                return { ok: false, reason: 'LOAD_ERROR', message: 'Failed to load audio source' };
            }

            // ✅ Check again if still valid after load
            if (thisAttemptId !== this.playAttemptId) {
                console.log('⏭️ Stale play attempt canceled after load');
                return { ok: false, reason: 'STALE_PLAY_ATTEMPT', message: 'Canceled by newer play request' };
            }

            // Play the audio
            await this.audioElement.play();
            this.isPlaying = true;

            console.log('✅ Audio playing!');
            return { ok: true };

        } catch (error: unknown) {
            // ✅ Handle AbortError as normal (user changed song quickly)
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('⏸️ Play aborted (normal - user paused or changed song)');
                return { ok: false, reason: 'ABORTED', message: 'Play request was interrupted' };
            }

            // ✅ Handle NotSupportedError with diagnostic
            if (error instanceof Error && error.name === 'NotSupportedError') {
                this.logAudioError('NotSupportedError - no supported source');
                return { 
                    ok: false, 
                    reason: 'NO_SOURCE', 
                    message: 'No se pudo reproducir: formato no soportado o URL inválida' 
                };
            }

            // Other errors
            console.error('❌ Play error:', error);
            this.logAudioError('Play error');
            this.isPlaying = false;

            return { 
                ok: false, 
                reason: 'UNKNOWN', 
                message: error instanceof Error ? error.message : 'Unknown error' 
            };
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

    async resume(): Promise<PlayResult> {
        try {
            if (!this.audioElement) {
                return { ok: false, reason: 'LOAD_ERROR', message: 'No audio element' };
            }

            // Resume audio context if suspended
            if (this.audioContext?.state === 'suspended') {
                await this.audioContext.resume();
            }

            await this.audioElement.play();
            this.isPlaying = true;
            return { ok: true };
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
                return { ok: false, reason: 'ABORTED', message: 'Resume interrupted' };
            }
            console.error('❌ Resume error:', error);
            return { ok: false, reason: 'UNKNOWN', message: error instanceof Error ? error.message : 'Unknown' };
        }
    }

    async togglePlayPause(): Promise<PlayResult> {
        if (this.isPlaying) {
            this.pause();
            return { ok: true };
        } else {
            return await this.resume();
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
            const dur = this.audioElement?.duration;
            return dur && !isNaN(dur) ? dur : 0;
        } catch {
            return 0;
        }
    }

    getProgress(): number {
        try {
            const duration = this.getDuration();
            if (!duration) return 0;
            const current = this.getCurrentTime();
            if (isNaN(current)) return 0;
            return current / duration;
        } catch {
            return 0;
        }
    }

    setEQ(settings: Partial<EQSettings>) {
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

    // ✅ Get audio element for external listeners (e.g., 'ended' event)
    getAudioElement(): HTMLAudioElement | null {
        return this.audioElement;
    }
}

export const audioService = new AudioService();
