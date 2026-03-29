import { useState, useEffect } from "react";
import RainyBG from "./assets/wp8997310-1404774826.jpg";
import WeatherCard from "./components/FWeatherCard";
import type { WeatherData, ForecastItem } from "./types";
import { AnimatePresence, motion } from 'motion/react';
import Cookies from 'js-cookie';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Reduces the 40 forecast entries (3-hour intervals over 5 days) returned by
 * the API down to one representative entry per calendar day.
 * We pick the entry with the highest pop (rain chance) for each day so that
 * the displayed rain chance reflects the worst case for that day, not just
 * whatever the first 3-hour slot (often midnight) happens to show.
 */
const getDailyForecasts = (list: ForecastItem[]): ForecastItem[] => {
  const byDay = new Map<string, ForecastItem>();

  for (const item of list) {
    // dt_txt format: "2026-03-28 18:00:00" — we only need the date part
    const date = item.dt_txt.split(" ")[0];
    const existing = byDay.get(date);

    // Keep this entry if it has a higher rain chance than the current best
    if (!existing || item.pop > existing.pop) {
      byDay.set(date, item);
    }
  }

  // Map preserves insertion order, so days stay chronological
  return Array.from(byDay.values()).slice(0, 5);
};

/**
 * Converts a Unix timestamp (seconds) to a weekday name e.g. "Monday".
 * The first card always shows "Today" regardless of the actual day.
 */
const getDayName = (dt: number, isToday: boolean): string => {
  if (isToday) return "Today";
  // Multiply by 1000 to convert seconds → milliseconds, which JS Date expects
  return new Date(dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
};

// ─── Types ────────────────────────────────────────────────────────────────────

/** Represents a city result returned by the OpenWeatherMap Geocoding API */
interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string; // Not always present depending on the country
}

// ─── Component ────────────────────────────────────────────────────────────────

const App = () => {
  // Controls the "searching" UI state — dims the background and shows the dropdown
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // The raw text value of the search input, used to trigger the geocoding fetch
  const [query, setQuery] = useState(Cookies.get("lastSearch") || ""); // Initialize with last search from cookie if available 

  // The list of city suggestions returned by the Geocoding API
  const [results, setResults] = useState<City[]>([]);

  // The city the user has selected from the dropdown, used to fetch weather data
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // The full 5-day forecast response from the OpenWeatherMap Forecast API
  const [weatherData, setWeatherData] = useState<WeatherData | null | "Loading">(null);
  
  //The units in which the Temperature and the wind speed will be displayed. Default is Metric
  const [selectedUnits, setSelectedUnits] = useState<"Metric" | "Imperial">("Metric");

  // ─── Geocoding Fetch (debounced) ───────────────────────────────────────────

  useEffect(() => {
    // Debounce: wait 500ms after the user stops typing before making the API call
    // This prevents a request firing on every single keystroke
    const timer = setTimeout(async () => {
      
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_WEATHER_API_KEY}`,
      );
      const data = await res.json();
      setResults(data);
      Cookies.set("lastSearch", query, { expires: 7 }); // Store the last search query in a cookie for 7 days
    }, 500);

    // Cleanup: if the user types again before 500ms, cancel the previous timer
    return () => clearTimeout(timer);
  }, [query]);

  // ─── Weather Fetch ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchWeather = async () => {
      // Do nothing until the user has selected a city from the dropdown
      if (!selectedCity) return;
      
      setWeatherData("Loading"); // Clear previous weather data while loading new data

      // The Forecast API requires lat/lon, which we got from the Geocoding API
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&units=${selectedUnits}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`,
      );
      const data = await res.json();
      setWeatherData(data);
    };

    fetchWeather();
  }, [selectedCity, selectedUnits]); // Re-runs whenever the user selects a different city

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectCity = (city: City) => {
    setSelectedCity(city); // Triggers the weather fetch effect above
    setQuery(city.name); // Fill the input with the selected city name
    setResults([]); // Close the dropdown
    setIsSearching(false); // Remove the blackout overlay
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col w-screen min-h-screen lg:h-screen place-content-center items-center bg-stone-300 p-4 sm:p-8 lg:p-16 gap-4 sm:gap-8 overflow-x-hidden">
      {/* Background image, positioned behind everything via z-0 */}
      <img src={RainyBG} className="fixed w-full h-full object-cover z-0 inset-0" />

      <div className="z-10 flex flex-col w-full min-h-screen lg:h-full place-content-center items-center gap-4 sm:gap-8 text-stone-100 py-4 sm:py-0">
        {/* Blackout overlay — shown while the search input is focused */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              id="blackout"
              className="w-screen h-screen bg-radial from-black/10 to-black/80 backdrop-blur-sm absolute z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto justify-center">
          {/* Search wrapper — `relative` is needed to anchor the dropdown */}
          <div className="relative z-60">
            {/* Search input element */}
            <motion.input
              onFocus={() => setIsSearching(true)}
              // Delay hiding the dropdown so onMouseDown on a result fires first
              onBlur={() => setTimeout(() => setIsSearching(false), 150)}
              type="search"
              placeholder="Search Cities"
              className="text-center px-1 py-2 rounded-full focus:outline-none transition-colors glass glass-hover drop-shadow-lg font-semibold"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            />
  
            {/* Dropdown — only visible when there are results and input is focused */}
            {results.length > 0 && isSearching && (
              <motion.ul
                className="absolute top-full mt-2 w-full min-w-50 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {results.map((city, i) => (
                  <li
                    key={i}
                    // onMouseDown fires before onBlur, so the click registers
                    // before the dropdown disappears
                    onMouseDown={() => handleSelectCity(city)}
                    className="px-4 py-2 text-stone-100 font-semibold hover:bg-white/20 cursor-pointer transition-colors"
                  >
                    {city.name}
                    {city.state ? `, ${city.state}` : ""}, {city.country}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
          
          {/* Temperature Units Selection */}
          <motion.div
            className="relative flex place-content-center items-center text-stone-100 font-semibold glass glass-hover transition-colors rounded-full px-4 py-2 cursor-pointer w-[110px] h-[38px]"
            onClick={() => setSelectedUnits(selectedUnits === "Metric" ? "Imperial" : "Metric")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {selectedUnits === "Metric" ? (
                <motion.span
                  key="metric"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  Metric
                </motion.span>
              ) : (
                <motion.span
                  key="imperial"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  Imperial
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Weather cards row */}
        <motion.div
          className="w-full lg:flex-1 flex flex-row flex-wrap place-content-center items-center rounded-2xl drop-shadow-2xl glass p-4 sm:p-8 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {
            weatherData === null
              ? (<span className="text-3xl"> Select A City</span>)
              : weatherData === "Loading"
                ? (Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <WeatherCard
                          key={i}
                          day={i === 0 ? "Today" : null}
                          icon="01d"
                          rainChance={null}
                          temperature={null}
                          today={i === 0}
                          description={null}
                          realFeel={null}
                          humidity={null}
                          wind={null}
                          units={selectedUnits}
                        />)))
                        : (getDailyForecasts(weatherData.list).map((item, i) => (
                          <WeatherCard
                            key={item.dt}
                            day={getDayName(item.dt, i === 0)}
                            icon={item.weather[0].icon}
                            rainChance={Math.round(item.pop * 100)} // pop is 0–1, convert to percentage
                            temperature={Math.round(item.main.temp)}
                            today={i === 0}
                            description={item.weather[0].description} // Optional: show weather description
                            realFeel={Math.round(item.main.feels_like)} // Optional: show "feels like" temperature
                            humidity={item.main.humidity} // Optional: show humidity percentage
                            wind={item.wind.speed} // Optional: show wind speed
                            units={selectedUnits} // Pass the selected units to the card for proper display
                          />)))
          }
        </motion.div>
      </div>
    </div>
  );
};

export default App;
