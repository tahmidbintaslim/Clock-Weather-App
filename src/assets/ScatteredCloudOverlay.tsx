const ScatteredCloudOverlay = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <g id="scatteredCloud">
                    <ellipse cx="20" cy="12" rx="12" ry="6" fill="white" opacity="0.8" />
                    <ellipse cx="28" cy="12" rx="8" ry="4" fill="white" opacity="0.6" />
                    <ellipse cx="16" cy="8" rx="6" ry="3" fill="white" opacity="0.7" />
                </g>
            </defs>

            <g className="animate-cloud-float">
                <use href="#scatteredCloud" x="0" y="30" />
                <use href="#scatteredCloud" x="120" y="20" transform="scale(0.8)" />
                <use href="#scatteredCloud" x="250" y="40" transform="scale(1.1)" />
            </g>

            <g className="animate-cloud-float-reverse">
                <use href="#scatteredCloud" x="180" y="10" transform="scale(0.7)" />
                <use href="#scatteredCloud" x="320" y="35" transform="scale(0.9)" />
            </g>

            <g className="animate-sun-peek" opacity="0.5">
                <line x1="100" y1="0" x2="100" y2="25" stroke="yellow" strokeWidth="2" opacity="0.6" />
                <line x1="150" y1="0" x2="150" y2="20" stroke="yellow" strokeWidth="1.5" opacity="0.5" />
                <line x1="200" y1="0" x2="200" y2="30" stroke="orange" strokeWidth="2" opacity="0.7" />
            </g>
        </svg>
    );
};

export default ScatteredCloudOverlay;
