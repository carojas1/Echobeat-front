import React from "react";
import { usePlayer } from "../contexts/PlayerContext";
import "./Equalizer.css";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => (
  <div className="eq-slider">
    <div className="eq-slider-header">
      <span>{label}</span>
      <span className="eq-value">{value > 0 ? `+${value}` : value} dB</span>
    </div>
    <input
      type="range"
      min={-12}
      max={12}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="eq-range"
    />
  </div>
);

const Equalizer: React.FC = () => {
  const { eq, setEQ } = usePlayer();

  return (
    <div className="equalizer-container">
      <div className="equalizer-header">
        <span className="equalizer-icon">🎚️</span>
        <span className="equalizer-title">Ecualizador</span>
      </div>
      
      <div className="eq-sliders">
        <Slider 
          label="Bajos" 
          value={eq.bass} 
          onChange={(v) => setEQ({ bass: v })} 
        />
        <Slider 
          label="Medios" 
          value={eq.mid} 
          onChange={(v) => setEQ({ mid: v })} 
        />
        <Slider 
          label="Agudos" 
          value={eq.treble} 
          onChange={(v) => setEQ({ treble: v })} 
        />
      </div>

      <button
        onClick={() => setEQ({ bass: 0, mid: 0, treble: 0 })}
        className="eq-reset-btn"
      >
        Reset
      </button>
    </div>
  );
};

export default Equalizer;
