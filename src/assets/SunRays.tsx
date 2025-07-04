const SunRays = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient id="sunGradient">
                    <stop offset="0%" stopColor="yellow" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="orange" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>

            {/* Central sun */}
            <circle
                cx="50%"
                cy="40%"
                r="30"
                fill="url(#sunGradient)"
                className="animate-[sunPulse_4s_ease-in-out_infinite]"
            />

            {/* Sun rays */}
            <g className="animate-[sunRotate_20s_linear_infinite]" transform-origin="50% 40%">
                {[...Array(12)].map((_, i) => (
                    <line
                        key={i}
                        x1="50%"
                        y1="20%"
                        x2="50%"
                        y2="10%"
                        stroke="yellow"
                        strokeWidth="2"
                        opacity="0.6"
                        transform={`rotate(${i * 30} 50% 40%)`}
                    />
                ))}
            </g>

            {/* Sparkles */}
            <g className="animate-[sparkle_3s_ease-in-out_infinite]">
                <circle cx="30%" cy="25%" r="2" fill="yellow" opacity="0.8" />
                <circle cx="70%" cy="30%" r="1.5" fill="yellow" opacity="0.6" />
                <circle cx="25%" cy="55%" r="1" fill="orange" opacity="0.7" />
                <circle cx="75%" cy="50%" r="1.8" fill="yellow" opacity="0.5" />
            </g>
        </svg>
    );
};

export default SunRays;
