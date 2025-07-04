const ThunderstormOverlay = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <g id="lightning">
                    <path
                        d="M10 0 L6 8 L10 8 L8 16 L14 6 L10 6 Z"
                        fill="yellow"
                        stroke="white"
                        strokeWidth="0.5"
                    />
                </g>
            </defs>

            {/* Lightning bolts with random timing */}
            <g className="animate-[lightning_3s_ease-in-out_infinite]">
                <use href="#lightning" x="30" y="20" transform="scale(1.2)" />
            </g>

            <g className="animate-[lightning_4s_ease-in-out_infinite] [animation-delay:1s]">
                <use href="#lightning" x="80" y="15" transform="scale(0.8)" />
            </g>

            <g className="animate-[lightning_5s_ease-in-out_infinite] [animation-delay:2.5s]">
                <use href="#lightning" x="130" y="25" transform="scale(1.1)" />
            </g>

            {/* Dark clouds for thunderstorm */}
            <g className="opacity-60">
                <ellipse cx="50" cy="10" rx="25" ry="12" fill="#2d3748" />
                <ellipse cx="80" cy="8" rx="20" ry="10" fill="#1a202c" />
                <ellipse cx="120" cy="12" rx="30" ry="15" fill="#2d3748" />
            </g>
        </svg>
    );
};

export default ThunderstormOverlay;
