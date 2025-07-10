import React, { useEffect, useRef, useState } from "react";

// Comprehensive country list with capitals and timezones
const COUNTRY_OPTIONS = [
    { label: "Afghanistan (Kabul)", tz: "Asia/Kabul", city: "Kabul,AF" },
    { label: "Albania (Tirana)", tz: "Europe/Tirane", city: "Tirana,AL" },
    { label: "Algeria (Algiers)", tz: "Africa/Algiers", city: "Algiers,DZ" },
    { label: "Argentina (Buenos Aires)", tz: "America/Argentina/Buenos_Aires", city: "Buenos Aires,AR" },
    { label: "Armenia (Yerevan)", tz: "Asia/Yerevan", city: "Yerevan,AM" },
    { label: "Australia (Sydney)", tz: "Australia/Sydney", city: "Sydney,AU" },
    { label: "Austria (Vienna)", tz: "Europe/Vienna", city: "Vienna,AT" },
    { label: "Azerbaijan (Baku)", tz: "Asia/Baku", city: "Baku,AZ" },
    { label: "Bahrain (Manama)", tz: "Asia/Bahrain", city: "Manama,BH" },
    { label: "Bangladesh (Dhaka)", tz: "Asia/Dhaka", city: "Dhaka,BD" },
    { label: "Belarus (Minsk)", tz: "Europe/Minsk", city: "Minsk,BY" },
    { label: "Belgium (Brussels)", tz: "Europe/Brussels", city: "Brussels,BE" },
    { label: "Bolivia (La Paz)", tz: "America/La_Paz", city: "La Paz,BO" },
    { label: "Brazil (Brasília)", tz: "America/Sao_Paulo", city: "Brasilia,BR" },
    { label: "Bulgaria (Sofia)", tz: "Europe/Sofia", city: "Sofia,BG" },
    { label: "Cambodia (Phnom Penh)", tz: "Asia/Phnom_Penh", city: "Phnom Penh,KH" },
    { label: "Canada (Ottawa)", tz: "America/Toronto", city: "Ottawa,CA" },
    { label: "Chile (Santiago)", tz: "America/Santiago", city: "Santiago,CL" },
    { label: "China (Beijing)", tz: "Asia/Shanghai", city: "Beijing,CN" },
    { label: "Colombia (Bogotá)", tz: "America/Bogota", city: "Bogota,CO" },
    { label: "Croatia (Zagreb)", tz: "Europe/Zagreb", city: "Zagreb,HR" },
    { label: "Czech Republic (Prague)", tz: "Europe/Prague", city: "Prague,CZ" },
    { label: "Denmark (Copenhagen)", tz: "Europe/Copenhagen", city: "Copenhagen,DK" },
    { label: "Ecuador (Quito)", tz: "America/Guayaquil", city: "Quito,EC" },
    { label: "Egypt (Cairo)", tz: "Africa/Cairo", city: "Cairo,EG" },
    { label: "Estonia (Tallinn)", tz: "Europe/Tallinn", city: "Tallinn,EE" },
    { label: "Ethiopia (Addis Ababa)", tz: "Africa/Addis_Ababa", city: "Addis Ababa,ET" },
    { label: "Finland (Helsinki)", tz: "Europe/Helsinki", city: "Helsinki,FI" },
    { label: "France (Paris)", tz: "Europe/Paris", city: "Paris,FR" },
    { label: "Georgia (Tbilisi)", tz: "Asia/Tbilisi", city: "Tbilisi,GE" },
    { label: "Germany (Berlin)", tz: "Europe/Berlin", city: "Berlin,DE" },
    { label: "Ghana (Accra)", tz: "Africa/Accra", city: "Accra,GH" },
    { label: "Greece (Athens)", tz: "Europe/Athens", city: "Athens,GR" },
    { label: "Hungary (Budapest)", tz: "Europe/Budapest", city: "Budapest,HU" },
    { label: "Iceland (Reykjavik)", tz: "Atlantic/Reykjavik", city: "Reykjavik,IS" },
    { label: "India (New Delhi)", tz: "Asia/Kolkata", city: "New Delhi,IN" },
    { label: "Indonesia (Jakarta)", tz: "Asia/Jakarta", city: "Jakarta,ID" },
    { label: "Iran (Tehran)", tz: "Asia/Tehran", city: "Tehran,IR" },
    { label: "Iraq (Baghdad)", tz: "Asia/Baghdad", city: "Baghdad,IQ" },
    { label: "Ireland (Dublin)", tz: "Europe/Dublin", city: "Dublin,IE" },
    { label: "Israel (Jerusalem)", tz: "Asia/Jerusalem", city: "Jerusalem,IL" },
    { label: "Italy (Rome)", tz: "Europe/Rome", city: "Rome,IT" },
    { label: "Japan (Tokyo)", tz: "Asia/Tokyo", city: "Tokyo,JP" },
    { label: "Jordan (Amman)", tz: "Asia/Amman", city: "Amman,JO" },
    { label: "Kazakhstan (Nur-Sultan)", tz: "Asia/Almaty", city: "Nur-Sultan,KZ" },
    { label: "Kenya (Nairobi)", tz: "Africa/Nairobi", city: "Nairobi,KE" },
    { label: "Kuwait (Kuwait City)", tz: "Asia/Kuwait", city: "Kuwait City,KW" },
    { label: "Latvia (Riga)", tz: "Europe/Riga", city: "Riga,LV" },
    { label: "Lebanon (Beirut)", tz: "Asia/Beirut", city: "Beirut,LB" },
    { label: "Lithuania (Vilnius)", tz: "Europe/Vilnius", city: "Vilnius,LT" },
    { label: "Luxembourg (Luxembourg City)", tz: "Europe/Luxembourg", city: "Luxembourg,LU" },
    { label: "Malaysia (Kuala Lumpur)", tz: "Asia/Kuala_Lumpur", city: "Kuala Lumpur,MY" },
    { label: "Mexico (Mexico City)", tz: "America/Mexico_City", city: "Mexico City,MX" },
    { label: "Morocco (Rabat)", tz: "Africa/Casablanca", city: "Rabat,MA" },
    { label: "Netherlands (Amsterdam)", tz: "Europe/Amsterdam", city: "Amsterdam,NL" },
    { label: "New Zealand (Wellington)", tz: "Pacific/Auckland", city: "Wellington,NZ" },
    { label: "Nigeria (Abuja)", tz: "Africa/Lagos", city: "Abuja,NG" },
    { label: "Norway (Oslo)", tz: "Europe/Oslo", city: "Oslo,NO" },
    { label: "Pakistan (Islamabad)", tz: "Asia/Karachi", city: "Islamabad,PK" },
    { label: "Peru (Lima)", tz: "America/Lima", city: "Lima,PE" },
    { label: "Philippines (Manila)", tz: "Asia/Manila", city: "Manila,PH" },
    { label: "Poland (Warsaw)", tz: "Europe/Warsaw", city: "Warsaw,PL" },
    { label: "Portugal (Lisbon)", tz: "Europe/Lisbon", city: "Lisbon,PT" },
    { label: "Qatar (Doha)", tz: "Asia/Qatar", city: "Doha,QA" },
    { label: "Romania (Bucharest)", tz: "Europe/Bucharest", city: "Bucharest,RO" },
    { label: "Russia (Moscow)", tz: "Europe/Moscow", city: "Moscow,RU" },
    { label: "Saudi Arabia (Riyadh)", tz: "Asia/Riyadh", city: "Riyadh,SA" },
    { label: "Serbia (Belgrade)", tz: "Europe/Belgrade", city: "Belgrade,RS" },
    { label: "Singapore (Singapore)", tz: "Asia/Singapore", city: "Singapore,SG" },
    { label: "Slovakia (Bratislava)", tz: "Europe/Bratislava", city: "Bratislava,SK" },
    { label: "Slovenia (Ljubljana)", tz: "Europe/Ljubljana", city: "Ljubljana,SI" },
    { label: "South Africa (Cape Town)", tz: "Africa/Johannesburg", city: "Cape Town,ZA" },
    { label: "South Korea (Seoul)", tz: "Asia/Seoul", city: "Seoul,KR" },
    { label: "Spain (Madrid)", tz: "Europe/Madrid", city: "Madrid,ES" },
    { label: "Sri Lanka (Colombo)", tz: "Asia/Colombo", city: "Colombo,LK" },
    { label: "Sweden (Stockholm)", tz: "Europe/Stockholm", city: "Stockholm,SE" },
    { label: "Switzerland (Bern)", tz: "Europe/Zurich", city: "Bern,CH" },
    { label: "Taiwan (Taipei)", tz: "Asia/Taipei", city: "Taipei,TW" },
    { label: "Thailand (Bangkok)", tz: "Asia/Bangkok", city: "Bangkok,TH" },
    { label: "Turkey (Ankara)", tz: "Europe/Istanbul", city: "Ankara,TR" },
    { label: "Ukraine (Kyiv)", tz: "Europe/Kiev", city: "Kyiv,UA" },
    { label: "United Arab Emirates (Abu Dhabi)", tz: "Asia/Dubai", city: "Abu Dhabi,AE" },
    { label: "United Kingdom (London)", tz: "Europe/London", city: "London,GB" },
    { label: "United States (Washington DC)", tz: "America/New_York", city: "Washington,US" },
    { label: "Uruguay (Montevideo)", tz: "America/Montevideo", city: "Montevideo,UY" },
    { label: "Venezuela (Caracas)", tz: "America/Caracas", city: "Caracas,VE" },
    { label: "Vietnam (Hanoi)", tz: "Asia/Ho_Chi_Minh", city: "Hanoi,VN" },
];

export interface Zone {
    label: string;
    tz: string;
    city: string;
}

interface CountrySelectorProps {
    selected: Zone[];
    onAdd: (zone: Zone) => void;
    onRemove: (zone: Zone) => void;
    max: number;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selected, onAdd, onRemove, max }) => {
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const filtered = COUNTRY_OPTIONS.filter(
        (c) =>
            !selected.some((s) => s.label === c.label) &&
            c.label.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setShowSuggestions(true);
        setHighlighted(0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || filtered.length === 0) return;
        if (e.key === "ArrowDown") {
            setHighlighted((prev) => (prev + 1) % filtered.length);
        } else if (e.key === "ArrowUp") {
            setHighlighted((prev) => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === "Enter") {
            if (filtered[highlighted]) {
                onAdd(filtered[highlighted]);
                setSearch("");
                setShowSuggestions(false);
            }
        }
    };

    return (
        <div className="mb-8 w-full max-w-4xl">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-base-content mb-1">
                    Compare Countries
                </h2>
                <p className="text-sm text-base-content/70">
                    Select up to {max} countries to compare their time and weather
                </p>
            </div>

            {/* Selected Countries */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                {selected.map((zone) => (
                    <div
                        key={zone.label}
                        className={`inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 px-3 py-2 rounded-full transition-all duration-200 hover:shadow-md hover:scale-105 animate-fadeIn`}
                    >
                        <span className="font-medium text-sm">{zone.label}</span>
                        <button
                            className="ml-2 text-error hover:text-error-focus transition-colors duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-error/50 rounded-full p-1"
                            onClick={() => onRemove(zone)}
                            aria-label={`Remove ${zone.label}`}
                            title={`Remove ${zone.label}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                {selected.length === 0 && (
                    <div className="text-sm text-base-content/50 italic">
                        No countries selected yet
                    </div>
                )}
            </div>

            {/* Search Input */}
            {selected.length < max && (
                <div className="relative w-full max-w-md">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            className="input input-bordered w-full pr-12 pl-4 py-3 text-base focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-base-100 placeholder-base-content/50"
                            placeholder="🔍 Search for a country..."
                            value={search}
                            onChange={handleInputChange}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                        />
                        {search && (
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors duration-200 p-1 rounded-full hover:bg-base-200"
                                onClick={() => {
                                    setSearch("");
                                    setShowSuggestions(false);
                                    inputRef.current?.focus();
                                }}
                                title="Clear search"
                                aria-label="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && search && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-64 overflow-hidden animate-slideDown">
                            <div className="max-h-64 overflow-y-auto">
                                {filtered.length === 0 ? (
                                    <div className="px-4 py-3 text-center text-base-content/50">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-sm">No countries found</p>
                                        <p className="text-xs text-base-content/40">Try a different search term</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 text-xs text-base-content/60 bg-base-200/50 border-b border-base-300">
                                            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                                        </div>
                                        {filtered.map((zone, idx) => (
                                            <div
                                                key={zone.label}
                                                className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between group ${idx === highlighted
                                                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                                                        : "hover:bg-base-200/50"
                                                    }`}
                                                onMouseDown={() => {
                                                    onAdd(zone);
                                                    setSearch("");
                                                    setShowSuggestions(false);
                                                }}
                                                onMouseEnter={() => setHighlighted(idx)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary/60 transition-colors duration-200"></div>
                                                    <div>
                                                        <div className="font-medium text-sm">{zone.label}</div>
                                                        <div className="text-xs text-base-content/60">{zone.tz}</div>
                                                    </div>
                                                </div>
                                                <svg className="w-4 h-4 text-base-content/40 group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Max countries message */}
            {selected.length >= max && (
                <div className="bg-warning/10 text-warning border border-warning/20 px-4 py-3 rounded-lg text-sm animate-fadeIn">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Maximum {max} countries selected. Remove a country to add another.</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountrySelector;
