import React, { useState, useEffect } from 'react';
import { IonIcon, IonRange } from '@ionic/react';
import { refresh } from 'ionicons/icons';
import { usePlayer } from '../../contexts/PlayerContext';
import { Preferences } from '@capacitor/preferences';
import './EqualizerConsole.css';

interface EQSettings {
    bass: number;
    mid: number;
    treble: number;
    preset: string;
}

const EqualizerConsole: React.FC = () => {
    const { eq, setEQ } = usePlayer();
    const [activePreset, setActivePreset] = useState('flat');

    const presets: Record<string, { bass: number; mid: number; treble: number }> = {
        flat: { bass: 0, mid: 0, treble: 0 },
        bassBoost: { bass: 8, mid: 0, treble: -2 },
        acoustic: { bass: 4, mid: 2, treble: 3 },
        rock: { bass: 6, mid: -1, treble: 5 },
        pop: { bass: 3, mid: 4, treble: 2 },
    };

    useEffect(() => {
        const loadEQSettings = async () => {
            try {
                const { value } = await Preferences.get({ key: 'eq_settings' });
                if (value) {
                    const settings = JSON.parse(value);
                    setEQ({ 
                        bass: settings.bass || 0, 
                        mid: settings.mid || 0, 
                        treble: settings.treble || 0 
                    });
                    setActivePreset(settings.preset || 'flat');
                }
            } catch (error) {
                console.error('Error loading EQ:', error);
            }
        };
        loadEQSettings();
    }, [setEQ]);

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
        setEQ({ bass: value });
        saveEQSettings({ bass: value, mid: eq.mid, treble: eq.treble, preset: 'custom' });
        setActivePreset('custom');
    };

    const handleMidChange = (value: number) => {
        setEQ({ mid: value });
        saveEQSettings({ bass: eq.bass, mid: value, treble: eq.treble, preset: 'custom' });
        setActivePreset('custom');
    };

    const handleTrebleChange = (value: number) => {
        setEQ({ treble: value });
        saveEQSettings({ bass: eq.bass, mid: eq.mid, treble: value, preset: 'custom' });
        setActivePreset('custom');
    };

    const applyPreset = (presetName: string) => {
        const preset = presets[presetName];
        if (preset) {
            setEQ({ bass: preset.bass, mid: preset.mid, treble: preset.treble });
            setActivePreset(presetName);
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
                        Bajos
                        <span className="eq-value">{eq.bass > 0 ? '+' : ''}{eq.bass}dB</span>
                    </label>
                    <IonRange
                        min={-12}
                        max={12}
                        step={1}
                        value={eq.bass}
                        onIonChange={(e) => handleBassChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>

                {/* Mid */}
                <div className="eq-slider-group">
                    <label>
                        Medios
                        <span className="eq-value">{eq.mid > 0 ? '+' : ''}{eq.mid}dB</span>
                    </label>
                    <IonRange
                        min={-12}
                        max={12}
                        step={1}
                        value={eq.mid}
                        onIonChange={(e) => handleMidChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>

                {/* Treble */}
                <div className="eq-slider-group">
                    <label>
                        Agudos
                        <span className="eq-value">{eq.treble > 0 ? '+' : ''}{eq.treble}dB</span>
                    </label>
                    <IonRange
                        min={-12}
                        max={12}
                        step={1}
                        value={eq.treble}
                        onIonChange={(e) => handleTrebleChange(e.detail.value as number)}
                        className="eq-range"
                    />
                </div>
            </div>
        </div>
    );
};

export default EqualizerConsole;
