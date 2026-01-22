import React, { useState, useEffect } from 'react';
import { IonIcon, IonRange } from '@ionic/react';
import { refresh } from 'ionicons/icons';
import { audioService } from '../../services/audio.service';
import { Preferences } from '@capacitor/preferences';
import './EqualizerConsole.css';

interface EQSettings {
    bass: number;
    mid: number;
    treble: number;
    volume: number;
    preset: string;
}

const EqualizerConsole: React.FC = () => {
    const [bass, setBass] = useState(0);
    const [mid, setMid] = useState(0);
    const [treble, setTreble] = useState(0);
    const [volume, setVolume] = useState(100);
    const [activePreset, setActivePreset] = useState('flat');

    const presets: Record<string, Omit<EQSettings, 'preset'>> = {
        flat: { bass: 0, mid: 0, treble: 0, volume: 100 },
        bassBoost: { bass: 8, mid: 0, treble: -2, volume: 100 },
        acoustic: { bass: 4, mid: 2, treble: 3, volume: 95 },
        rock: { bass: 6, mid: -1, treble: 5, volume: 100 },
        pop: { bass: 3, mid: 4, treble: 2, volume: 100 },
    };

    useEffect(() => {
        loadEQSettings();
    }, []);

    const loadEQSettings = async () => {
        try {
            const { value } = await Preferences.get({ key: 'eq_settings' });
            if (value) {
                const settings = JSON.parse(value);
                setBass(settings.bass || 0);
                setMid(settings.mid || 0);
                setTreble(settings.treble || 0);
                setVolume(settings.volume || 100);
                setActivePreset(settings.preset || 'flat');
            }
        } catch (error) {
            console.error('Error loading EQ:', error);
        }
    };

    const saveEQSettings = async (settings: EQSettings) => {
        try {
            await Preferences.set({
                key: 'eq_settings',
                value: JSON.stringify(settings),
            });
        } catch (error) {
            console.error('Error saving EQ:', error);
        }
    };

    const handleBassChange = (value: number) => {
        setBass(value);
        audioService.setEQ({ bass: value });
        saveEQSettings({ bass: value, mid, treble, volume, preset: activePreset });
    };

    const handleMidChange = (value: number) => {
        setMid(value);
        audioService.setEQ({ mid: value });
        saveEQSettings({ bass, mid: value, treble, volume, preset: activePreset });
    };

    const handleTrebleChange = (value: number) => {
        setTreble(value);
        audioService.setEQ({ treble: value });
        saveEQSettings({ bass, mid, treble: value, volume, preset: activePreset });
    };

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        audioService.setVolume(value / 100);
        saveEQSettings({ bass, mid, treble, volume: value, preset: activePreset });
    };

    const applyPreset = (presetName: string) => {
        const preset = presets[presetName];
        if (preset) {
            setBass(preset.bass);
            setMid(preset.mid);
            setTreble(preset.treble);
            setVolume(preset.volume);
            setActivePreset(presetName);
            audioService.setEQ({ bass: preset.bass, mid: preset.mid, treble: preset.treble });
            audioService.setVolume(preset.volume / 100);
            saveEQSettings({ ...preset, preset: presetName });
        }
    };

    return (
        <div className="eq-console glass">
            <div className="eq-header">
                <h3 className="eq-title">🎛️ Ecualizador</h3>
                <button className="eq-reset-btn" onClick={() => applyPreset('flat')}>
                    <IonIcon icon={refresh} />
                    Reset
                </button>
            </div>

            {/* Presets */}
            <div className="eq-presets">
                {Object.keys(presets).map((presetName) => (
                    <button
                        key={presetName}
                        className={`eq-preset-btn ${activePreset === presetName ? 'active' : ''}`}
                        onClick={() => applyPreset(presetName)}
                    >
                        {presetName === 'bassBoost' ? 'Bass Boost' : presetName.charAt(0).toUpperCase() + presetName.slice(1)}
                    </button>
                ))}
            </div>

            {/* EQ Controls */}
            <div className="eq-controls">
                {/* Bass */}
                <div className="eq-slider-group">
                    <label>
                        Bass
                        <span className="eq-value">{bass > 0 ? '+' : ''}{bass}dB</span>
                    </label>
                    <IonRange
                        min={-12}
                        max={12}
                        step={1}
                        value={bass}
                        onIonChange={(e) => handleBassChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>

                {/* Mid */}
                <div className="eq-slider-group">
                    <label>
                        Mid
                        <span className="eq-value">{mid > 0 ? '+' : ''}{mid}dB</span>
                    </label>
                    <IonRange
                        min={-12}
                        max={12}
                        step={1}
                        value={mid}
                        onIonChange={(e) => handleMidChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>

                {/* Treble */}
                <div className="eq-slider-group">
                    <label>
                        Treble
                        <span className="eq-value">{treble > 0 ? '+' : ''}{treble}dB</span>
                    </label>
                    <IonRange
                        min={-12}
                        max={12}
                        step={1}
                        value={treble}
                        onIonChange={(e) => handleTrebleChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>

                {/* Volume */}
                <div className="eq-slider-group">
                    <label>
                        Volume
                        <span className="eq-value">{volume}%</span>
                    </label>
                    <IonRange
                        min={0}
                        max={100}
                        step={1}
                        value={volume}
                        onIonChange={(e) => handleVolumeChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>
            </div>
        </div>
    );
};

export default EqualizerConsole;
