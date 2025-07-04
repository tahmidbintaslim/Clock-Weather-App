interface TemperatureMeterProps {
    temperature: number;
    className?: string;
}

const TemperatureMeter = ({ temperature, className = "" }: TemperatureMeterProps) => {
    // Calculate temperature level (0-100) for visualization
    // Range: -20°C to 50°C mapped to 0-100%
    const tempLevel = Math.max(0, Math.min(100, ((temperature + 20) / 70) * 100));

    // Determine color based on temperature
    const getTemperatureColor = () => {
        if (temperature <= 0) return "#60A5FA"; // Blue
        if (temperature <= 10) return "#34D399"; // Green
        if (temperature <= 20) return "#FCD34D"; // Yellow
        if (temperature <= 30) return "#FB923C"; // Orange
        return "#EF4444"; // Red
    };

    const temperatureColor = getTemperatureColor();

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {/* Temperature Meter */}
            <div className="relative">
                <svg width="24" height="80" viewBox="0 0 24 80" className="drop-shadow-sm">
                    {/* Thermometer tube */}
                    <rect
                        x="8"
                        y="10"
                        width="8"
                        height="50"
                        rx="4"
                        fill="currentColor"
                        fillOpacity="0.3"
                        stroke="currentColor"
                        strokeOpacity="0.5"
                        strokeWidth="1"
                    />

                    {/* Temperature fill */}
                    <rect
                        x="9"
                        y={60 - (tempLevel * 0.48)} // Scale to fit tube height
                        width="6"
                        height={tempLevel * 0.48}
                        rx="3"
                        fill={temperatureColor}
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Thermometer bulb */}
                    <circle
                        cx="12"
                        cy="68"
                        r="7"
                        fill={temperatureColor}
                        stroke="currentColor"
                        strokeOpacity="0.5"
                        strokeWidth="1"
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Temperature marks */}
                    <g stroke="currentColor" strokeOpacity="0.6" strokeWidth="1">
                        <line x1="16" y1="15" x2="19" y2="15" /> {/* 40°C */}
                        <line x1="16" y1="25" x2="18" y2="25" /> {/* 30°C */}
                        <line x1="16" y1="35" x2="19" y2="35" /> {/* 20°C */}
                        <line x1="16" y1="45" x2="18" y2="45" /> {/* 10°C */}
                        <line x1="16" y1="55" x2="19" y2="55" /> {/* 0°C */}
                    </g>
                </svg>
            </div>

            {/* Barometer/Pressure Indicator */}
            <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-sm">
                    {/* Barometer circle */}
                    <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="currentColor"
                        fillOpacity="0.2"
                        stroke="currentColor"
                        strokeOpacity="0.5"
                        strokeWidth="2"
                    />

                    {/* Pressure scale marks */}
                    <g stroke="currentColor" strokeOpacity="0.6" strokeWidth="1" fill="currentColor" fillOpacity="0.8">
                        {/* Major marks every 45 degrees */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
                            const radian = (angle * Math.PI) / 180;
                            const x1 = 20 + 15 * Math.cos(radian);
                            const y1 = 20 + 15 * Math.sin(radian);
                            const x2 = 20 + 12 * Math.cos(radian);
                            const y2 = 20 + 12 * Math.sin(radian);

                            return (
                                <line
                                    key={angle}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    strokeWidth={index % 2 === 0 ? "2" : "1"}
                                />
                            );
                        })}
                    </g>

                    {/* Pressure needle */}
                    <g transform={`rotate(${(tempLevel * 2.7) - 135} 20 20)`}>
                        <line
                            x1="20"
                            y1="20"
                            x2="20"
                            y2="8"
                            stroke={temperatureColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="2"
                            fill={temperatureColor}
                            className="transition-all duration-1000 ease-out"
                        />
                    </g>

                    {/* Center labels */}
                    <text
                        x="20"
                        y="32"
                        textAnchor="middle"
                        className="text-[6px] fill-current opacity-70"
                        fontFamily="monospace"
                    >
                        °C
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default TemperatureMeter;
