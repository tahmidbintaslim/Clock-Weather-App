const SnowOverlay = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <g id="snowflake">
                    <circle cx="0" cy="0" r="2" fill="white" />
                    <line x1="-3" y1="0" x2="3" y2="0" stroke="white" strokeWidth="0.5" />
                    <line x1="0" y1="-3" x2="0" y2="3" stroke="white" strokeWidth="0.5" />
                    <line x1="-2" y1="-2" x2="2" y2="2" stroke="white" strokeWidth="0.3" />
                    <line x1="-2" y1="2" x2="2" y2="-2" stroke="white" strokeWidth="0.3" />
                </g>
            </defs>

            <g className="animate-[snowFall_8s_linear_infinite]">
                <use href="#snowflake" x="20" y="0" />
                <use href="#snowflake" x="80" y="-20" />
                <use href="#snowflake" x="140" y="-10" />
                <use href="#snowflake" x="200" y="-30" />
                <use href="#snowflake" x="260" y="-5" />
            </g>

            <g className="animate-[snowFall_12s_linear_infinite]">
                <use href="#snowflake" x="50" y="-15" transform="scale(0.8)" />
                <use href="#snowflake" x="110" y="-25" transform="scale(1.2)" />
                <use href="#snowflake" x="170" y="-5" transform="scale(0.6)" />
                <use href="#snowflake" x="230" y="-35" transform="scale(1.1)" />
            </g>

            <g className="animate-[snowFall_15s_linear_infinite]">
                <use href="#snowflake" x="35" y="-40" transform="scale(0.7)" />
                <use href="#snowflake" x="95" y="-10" transform="scale(0.9)" />
                <use href="#snowflake" x="155" y="-30" transform="scale(1.3)" />
                <use href="#snowflake" x="215" y="-20" transform="scale(0.5)" />
            </g>
        </svg>
    );
};

export default SnowOverlay;
