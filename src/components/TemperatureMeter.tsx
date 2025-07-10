interface TemperatureMeterProps {
    temperature: number;
    className?: string;
}

const TemperatureMeter = ({ temperature, className = "" }: TemperatureMeterProps) => {
    const tempLevel = Math.max(0, Math.min(100, ((temperature + 20) / 70) * 100));

    const getTemperatureColor = () => {
        if (temperature <= 0) return "#60A5FA";
        if (temperature <= 10) return "#34D399";
        if (temperature <= 20) return "#FCD34D";
        if (temperature <= 30) return "#FB923C";
        return "#EF4444";
    };

    const temperatureColor = getTemperatureColor();

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <div className="relative">
                <svg width="24" height="80" viewBox="0 0 24 80" className="drop-shadow-sm">
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

                    <rect
                        x="9"
                        y={60 - (tempLevel * 0.48)}
                        width="6"
                        height={tempLevel * 0.48}
                        rx="3"
                        fill={temperatureColor}
                        className="transition-all duration-1000 ease-out"
                    />

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

                    <g stroke="currentColor" strokeOpacity="0.6" strokeWidth="1">
                        <line x1="16" y1="15" x2="19" y2="15" />
                        <line x1="16" y1="25" x2="18" y2="25" />
                        <line x1="16" y1="35" x2="19" y2="35" />
                        <line x1="16" y1="45" x2="18" y2="45" />
                        <line x1="16" y1="55" x2="19" y2="55" />
                    </g>
                </svg>
            </div>

            <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-sm">
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

                    <g stroke="currentColor" strokeOpacity="0.6" strokeWidth="1" fill="currentColor" fillOpacity="0.8">
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
