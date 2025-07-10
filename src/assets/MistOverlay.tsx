const MistOverlay = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="mistGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            <g className="animate-[mistFlow_15s_linear_infinite]">
                <rect x="0" y="20" width="100%" height="8" fill="url(#mistGradient)" />
                <rect x="0" y="40" width="100%" height="6" fill="url(#mistGradient)" opacity="0.7" />
                <rect x="0" y="60" width="100%" height="10" fill="url(#mistGradient)" opacity="0.5" />
                <rect x="0" y="80" width="100%" height="7" fill="url(#mistGradient)" opacity="0.6" />
            </g>

            <g className="animate-[mistFlow_20s_linear_infinite_reverse]">
                <rect x="0" y="30" width="100%" height="5" fill="url(#mistGradient)" opacity="0.4" />
                <rect x="0" y="50" width="100%" height="9" fill="url(#mistGradient)" opacity="0.3" />
                <rect x="0" y="70" width="100%" height="6" fill="url(#mistGradient)" opacity="0.5" />
            </g>
        </svg>
    );
};

export default MistOverlay;
