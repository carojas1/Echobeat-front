import React, { useEffect } from 'react';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    size = 'medium',
    animated = true,
    className = ''
}) => {
    const sizes = {
        small: 120,
        medium: 200,
        large: 280
    };

    const logoSize = sizes[size];

    // Inject CSS animations PROPERLY with cleanup
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
          @keyframes vinyl-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes wave-left {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-5px); }
          }
          
          @keyframes wave-right {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          .vinyl-rotate {
            animation: vinyl-rotate 8s linear infinite;
            transform-origin: center;
          }
          
          .wave-animate-left {
            animation: wave-left 2s ease-in-out infinite;
          }
          
          .wave-animate-right {
            animation: wave-right 2s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
        `;
        
        document.head.appendChild(style);
        
        // CLEANUP - Remove style when component unmounts
        return () => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, []);

    return (
        <svg
            width={logoSize}
            height={logoSize * 0.5}
            viewBox="0 0 600 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`echobeat-logo ${animated ? 'animate-pulse-slow' : ''} ${className}`}
        >
            {/* Waveform izquierda */}
            <path
                d="M 40 150 Q 60 150, 65 120 Q 70 100, 80 110 Q 90 120, 100 90 Q 110 60, 120 80 Q 130 100, 140 70 Q 150 40, 160 60 Q 170 80, 180 50 Q 190 20, 200 40"
                stroke="url(#blueGradient)"
                strokeWidth="4"
                fill="none"
                className={animated ? 'wave-animate-left' : ''}
            />

            {/* Vinyl Disco central */}
            <g transform="translate(300, 150)">
                {/* Disco exterior */}
                <circle
                    cx="0"
                    cy="0"
                    r="120"
                    fill="url(#vinylGradient)"
                    className={animated ? 'vinyl-rotate' : ''}
                />

                {/* Grooves del vinyl */}
                <circle cx="0" cy="0" r="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

                {/* Label central */}
                <circle cx="0" cy="0" r="40" fill="#000000" />
                <circle cx="0" cy="0" r="38" fill="url(#labelGradient)" />

                {/* Hole central */}
                <circle cx="0" cy="0" r="8" fill="#000000" />
            </g>

            {/* Waveform derecha */}
            <path
                d="M 400 40 Q 410 20, 420 50 Q 430 80, 440 60 Q 450 40, 460 70 Q 470 100, 480 80 Q 490 60, 500 90 Q 510 120, 520 110 Q 530 100, 535 120 Q 540 150, 560 150"
                stroke="url(#blueGradient)"
                strokeWidth="4"
                fill="none"
                className={animated ? 'wave-animate-right' : ''}
            />

            {/* Gradientes */}
            <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>

                <radialGradient id="vinylGradient">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E5E5E5" />
                </radialGradient>

                <radialGradient id="labelGradient">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#2563EB" />
                </radialGradient>
            </defs>
        </svg>
    );
};

export default Logo;
