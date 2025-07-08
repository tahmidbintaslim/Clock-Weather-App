import CloudOverlay from "@/assets/CloudOverlay";
import MistOverlay from "@/assets/MistOverlay";
import RainOverlay from "@/assets/RainOverlay";
import ScatteredCloudOverlay from "@/assets/ScatteredCloudOverlay";
import SnowOverlay from "@/assets/SnowOverlay";
import SunRays from "@/assets/SunRays";
import ThunderstormOverlay from "@/assets/ThunderstormOverlay";
import TemperatureMeter from "@/components/TemperatureMeter";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Weather Clock App
 * 
 * To get weather data working:
 * 1. Get a free API key from https://openweathermap.org/api
 * 2. Replace 'demo_key_replace_with_real_key' in .env file with your actual API key
 * 3. Restart the development server if needed
 * 
 * The app will work without an API key but will show "Weather unavailable"
 */

interface Zone {
  label: string;
  tz: string;
  city: string;
}
interface WeatherInfo {
  temp: number;
  desc: string;
  icon: string;
  main: string;
}

const zones: Zone[] = [
  { label: "Chile (Santiago)", tz: "America/Santiago", city: "Santiago,CL" },
  { label: "Bangladesh (Dhaka)", tz: "Asia/Dhaka", city: "Dhaka,BD" },
  { label: "Thailand (Bangkok)", tz: "Asia/Bangkok", city: "Bangkok,TH" },
];

export default function App() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [weather, setWeather] = useState<Record<string, WeatherInfo | null>>(
    zones.reduce((a, z) => ({ ...a, [z.label]: null }), {})
  );
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [weatherLoading, setWeatherLoading] = useState<Record<string, boolean>>(
    zones.reduce((a, z) => ({ ...a, [z.label]: true }), {})
  );
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    zones.reduce((a, z) => ({ ...a, [z.label]: false }), {})
  );

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Theme change handler
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  // Individual refresh handler
  const refreshWeatherForCity = async (zone: Zone) => {
    const key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    if (!key) {
      // No API key available
      setWeather((prev) => ({ ...prev, [zone.label]: null }));
      setWeatherLoading((prev) => ({ ...prev, [zone.label]: false }));
      return;
    }

    try {
      setWeatherLoading((prev) => ({ ...prev, [zone.label]: true }));

      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        { params: { q: zone.city, units: "metric", appid: key } }
      );
      const w = res.data;

      setWeather((prev) => ({
        ...prev,
        [zone.label]: {
          temp: w.main.temp,
          desc: w.weather[0].description,
          icon: w.weather[0].icon,
          main: w.weather[0].main.toLowerCase(),
        },
      }));

      // Show notification
      setNotifications((prev) => ({ ...prev, [zone.label]: true }));

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => ({ ...prev, [zone.label]: false }));
      }, 3000);

    } catch {
      // Silently handle refresh errors in production
      setWeather((prev) => ({ ...prev, [zone.label]: null }));
    } finally {
      setWeatherLoading((prev) => ({ ...prev, [zone.label]: false }));
    }
  };

  // Clock updater
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t: Record<string, string> = {};
      zones.forEach(({ label, tz }) => {
        // Get time in 12-hour format with AM/PM
        const timeString = now.toLocaleTimeString("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        // Get day of the week for the timezone
        const dayString = now.toLocaleDateString("en-US", {
          timeZone: tz,
          weekday: "long",
        });

        // Get timezone offset
        const tempDate = new Date(now.toLocaleString("en-US", { timeZone: tz }));
        const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
        const offsetMs = tempDate.getTime() - utcDate.getTime();
        const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
        const gmtOffset = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;

        t[label] = `${dayString}|${timeString} (GMT${gmtOffset})`;
      });
      setTimes(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Weather fetcher
  useEffect(() => {
    const key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    if (!key) {
      // No API key - set loading to false and weather to null for all zones
      zones.forEach(({ label }) => {
        setWeatherLoading((prev) => ({ ...prev, [label]: false }));
        setWeather((prev) => ({ ...prev, [label]: null }));
      });
      return;
    }

    const fetchWeatherForCity = async ({ label, city }: Zone) => {
      try {
        setWeatherLoading((prev) => ({ ...prev, [label]: true }));

        const res = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          { params: { q: city, units: "metric", appid: key } }
        );
        const w = res.data;

        setWeather((prev) => ({
          ...prev,
          [label]: {
            temp: w.main.temp,
            desc: w.weather[0].description,
            icon: w.weather[0].icon,
            main: w.weather[0].main.toLowerCase(),
          },
        }));
      } catch {
        // Silently handle weather fetch errors in production
        setWeather((prev) => ({ ...prev, [label]: null }));
      } finally {
        setWeatherLoading((prev) => ({ ...prev, [label]: false }));
      }
    };

    // Fetch weather for all cities
    zones.forEach(fetchWeatherForCity);
  }, []);

  const getWeatherOverlay = (main?: string, desc?: string, timezone?: string) => {
    if (!main) return null;

    const condition = main.toLowerCase();
    const description = desc?.toLowerCase() || "";

    // Determine if it's night
    const isNight = timezone ? (() => {
      const now = new Date();
      const hour = new Date(now.toLocaleString("en-US", { timeZone: timezone })).getHours();
      return hour < 6 || hour >= 18;
    })() : false;

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <RainOverlay />;
    }

    if (condition.includes("thunderstorm")) {
      return <ThunderstormOverlay />;
    }

    if (condition.includes("snow")) {
      return <SnowOverlay />;
    }

    if (condition.includes("cloud")) {
      // Scattered clouds - show sun peeking through
      if (description.includes("scattered") || description.includes("few")) {
        return <ScatteredCloudOverlay />;
      }

      // Overcast/broken clouds - dense cloud cover
      if (description.includes("overcast") || description.includes("broken")) {
        return <CloudOverlay />;
      }

      // Default clouds
      return <CloudOverlay />;
    }

    if (condition.includes("clear")) {
      if (isNight) {
        // Night sky with stars
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Stars */}
            <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full animate-sparkle"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-sparkle animation-delay-500"></div>
            <div className="absolute top-12 left-16 w-1 h-1 bg-white rounded-full animate-sparkle animation-delay-1000"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-sparkle animation-delay-1500"></div>
            <div className="absolute top-6 right-12 w-1 h-1 bg-white rounded-full animate-sparkle animation-delay-2000"></div>
            <div className="absolute top-16 left-8 w-1 h-1 bg-white rounded-full animate-sparkle animation-delay-2500"></div>

            {/* Moon */}
            <div className="absolute top-6 right-6 w-8 h-8 bg-yellow-100 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute top-7 right-7 w-6 h-6 bg-yellow-200 rounded-full opacity-60"></div>
          </div>
        );
      }
      return <SunRays />;
    }

    if (condition.includes("mist") || condition.includes("fog") ||
      condition.includes("haze") || condition.includes("smoke")) {
      return <MistOverlay />;
    }

    return null;
  };


  const themes = ["light", "dark", "cupcake", "corporate", "synthwave"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with theme selector */}
      <header className="flex justify-between items-center p-4 header-glass relative z-50">
        <h1 className="text-xl font-bold">World Clock & Weather</h1>
        <div className="dropdown dropdown-end relative z-50">
          <div tabIndex={0} role="button" className="btn m-1">
            {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[100]"
          >
            {themes.map((theme) => (
              <li key={theme}>
                <button
                  className={`flex items-center justify-between ${currentTheme === theme ? "active bg-primary text-primary-content" : ""
                    }`}
                  onClick={() => handleThemeChange(theme)}
                >
                  <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                  {currentTheme === theme && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Main grid - centered vertically */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 w-full max-w-7xl">
          {zones.map((zone) => {
            const w = weather[zone.label];
            const isLoading = weatherLoading[zone.label];
            const showNotification = notifications[zone.label];
            const overlay = getWeatherOverlay(w?.main, w?.desc, zone.tz);

            // Determine if it's day or night for the icon
            const now = new Date();
            const hour = new Date(now.toLocaleString("en-US", { timeZone: zone.tz })).getHours();
            const isNight = hour < 6 || hour >= 18;

            return (
              <div key={zone.label} className="weather-card-container group">
                {/* Card loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm rounded-20 flex items-center justify-center">
                    <div className="loading-container">
                      <div className="loading loading-spinner loading-lg text-white"></div>
                      <span className="text-white font-medium mt-2">Updating weather...</span>
                    </div>
                  </div>
                )}

                {/* Animated background layers */}
                <div className="weather-card interactive-card">
                  {/* Sky backgrounds */}
                  <div className={`sky-bg ${isNight ? 'night-sky' : 'day-sky'}`}></div>
                  {w?.main && (
                    <div className={`weather-sky ${w.main.toLowerCase()}-sky`}></div>
                  )}

                  {/* Celestial object (sun/moon) with animation */}
                  <div className={`celestial-container ${isNight ? 'moon-position' : 'sun-position'}`}>
                    <div className={`celestial-object ${isNight ? 'moon' : 'sun'}`}>
                      {!isNight && (
                        <>
                          <div className="sun-glow sun-glow-1"></div>
                          <div className="sun-glow sun-glow-2"></div>
                          <div className="sun-glow sun-glow-3"></div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Weather overlay animations */}
                  {overlay}

                  {/* Interactive hover overlay */}
                  <div className="hover-overlay"></div>

                  {/* Text content */}
                  <div className="weather-text-container">
                    {/* City name and day/night indicator */}
                    <div className="city-header enhanced-header">
                      <div className="city-info">
                        <h3 className="city-name">{zone.label}</h3>
                        <div className="city-country">{zone.city.split(',')[0]}</div>
                      </div>
                      <div className={`day-night-indicator enhanced-indicator ${isNight ? 'night-mode' : 'day-mode'}`}>
                        {isNight ? (
                          <div className="indicator-content">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
                            </svg>
                            <span>Night</span>
                          </div>
                        ) : (
                          <div className="indicator-content">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                            <span>Day</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Day of the week */}
                    <div className="day-display enhanced-day">
                      <div className="day-text">
                        {times[zone.label]?.split('|')[0] || "Loading..."}
                      </div>
                    </div>

                    {/* Time display */}
                    <div className="time-display enhanced-time">
                      <div className="time-main">{times[zone.label]?.split('|')[1]?.split(' ')[0] || "--:--:--"}</div>
                      <div className="time-secondary">
                        <span className="time-period">{times[zone.label]?.split('|')[1]?.split(' ')[1] || "AM"}</span>
                        <span className="timezone">{times[zone.label]?.split('|')[1]?.match(/\(GMT[^)]*\)/)?.[0] || "(GMT+0)"}</span>
                      </div>
                    </div>

                    {/* Weather info */}
                    <div className="weather-info enhanced-weather">
                      {w ? (
                        <>
                          <div className="temperature-section">
                            <div className={`temperature ${getTemperatureClass(w.temp)}`}>
                              {w.temp.toFixed(0)}
                              <span className="degree-symbol">°C</span>
                            </div>
                            <div className="feels-like">
                              Feels like {w.temp.toFixed(0)}°C
                            </div>
                          </div>
                          <div className="weather-desc">{w.desc}</div>
                          <TemperatureMeter temperature={w.temp} className="justify-center mt-3" />
                        </>
                      ) : (
                        <div className="weather-unavailable">
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>Weather unavailable</span>
                          <div className="retry-hint">
                            {import.meta.env.VITE_OPEN_WEATHER_API_KEY === 'demo_key_replace_with_real_key' || !import.meta.env.VITE_OPEN_WEATHER_API_KEY
                              ? 'Add your OpenWeatherMap API key to .env file'
                              : 'Check your internet connection and try refreshing'
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ground layers */}
                  <div className={`ground ground-1 ${isNight ? 'night-ground' : 'day-ground'}`}></div>
                  <div className={`ground ground-2 ${isNight ? 'night-ground' : 'day-ground'}`}></div>

                  {/* Enhanced refresh button and notification */}
                  <div className="card-footer enhanced-footer">
                    {/* Beautiful notification positioned above the refresh button */}
                    {showNotification && (
                      <div className="refresh-notification enhanced-notification">
                        <div className="notification-content">
                          <div className="notification-icon">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span>Weather Updated!</span>
                        </div>
                        <div className="notification-arrow"></div>
                      </div>
                    )}

                    <Button
                      className="refresh-button enhanced-button"
                      onClick={() => refreshWeatherForCity(zone)}
                      disabled={isLoading}
                      aria-label={`Refresh weather for ${zone.label}`}
                    >
                      <div className="button-content">
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center items-center p-4 footer-glass">
        <p className="text-sm">© {new Date().getFullYear()} Devsaround</p>
      </footer>
    </div>
  );

  // Helper function to get temperature class for color coding
  function getTemperatureClass(temp: number): string {
    if (temp >= 30) return 'hot';
    if (temp >= 20) return 'warm';
    if (temp >= 10) return 'mild';
    if (temp >= 0) return 'cool';
    return 'cold';
  }
}
