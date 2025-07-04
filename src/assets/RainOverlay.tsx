const RainOverlay = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id="rain" width="15" height="20" patternUnits="userSpaceOnUse">
                    <line x1="2" y1="0" x2="2" y2="18" stroke="lightblue" strokeWidth="1.5" opacity="0.8" />
                    <line x1="7" y1="0" x2="7" y2="15" stroke="lightblue" strokeWidth="1" opacity="0.6" />
                    <line x1="12" y1="0" x2="12" y2="20" stroke="lightblue" strokeWidth="1.2" opacity="0.7" />
                </pattern>

                <pattern id="heavyRain" width="12" height="18" patternUnits="userSpaceOnUse">
                    <line x1="1" y1="0" x2="1" y2="16" stroke="lightblue" strokeWidth="2" opacity="0.9" />
                    <line x1="4" y1="0" x2="4" y2="14" stroke="lightblue" strokeWidth="1.5" opacity="0.8" />
                    <line x1="7" y1="0" x2="7" y2="18" stroke="lightblue" strokeWidth="2.2" opacity="0.9" />
                    <line x1="10" y1="0" x2="10" y2="15" stroke="lightblue" strokeWidth="1.8" opacity="0.7" />
                </pattern>
            </defs>

            {/* Multiple rain layers for depth */}
            <rect
                width="100%"
                height="100%"
                fill="url(#rain)"
                className="animate-rain-drop"
            />
            <rect
                width="100%"
                height="100%"
                fill="url(#heavyRain)"
                className="animate-rain-drop-delayed"
                opacity="0.6"
            />

            {/* Rain splashes */}
            <g className="animate-rain-splash">
                <ellipse cx="20%" cy="90%" rx="3" ry="1" fill="lightblue" opacity="0.4" />
                <ellipse cx="45%" cy="95%" rx="2" ry="0.8" fill="lightblue" opacity="0.3" />
                <ellipse cx="70%" cy="88%" rx="4" ry="1.2" fill="lightblue" opacity="0.5" />
                <ellipse cx="85%" cy="92%" rx="2.5" ry="0.9" fill="lightblue" opacity="0.4" />
            </g>
        </svg>
    );
};

export default RainOverlay;
