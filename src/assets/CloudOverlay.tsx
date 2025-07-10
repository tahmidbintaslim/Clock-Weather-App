const CloudOverlay = () => {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <g id="cloud">
                    <ellipse cx="25" cy="15" rx="15" ry="8" fill="white" opacity="0.8" />
                    <ellipse cx="35" cy="15" rx="12" ry="6" fill="white" opacity="0.6" />
                    <ellipse cx="20" cy="10" rx="8" ry="5" fill="white" opacity="0.7" />
                </g>
            </defs>

            <g className="animate-cloud-float">
                <use href="#cloud" x="0" y="20" />
                <use href="#cloud" x="80" y="10" transform="scale(0.8)" />
                <use href="#cloud" x="150" y="25" transform="scale(1.2)" />
            </g>

            <g className="animate-cloud-float-reverse">
                <use href="#cloud" x="200" y="5" transform="scale(0.9)" />
                <use href="#cloud" x="300" y="30" transform="scale(0.7)" />
            </g>
        </svg>
    );
};

export default CloudOverlay;
