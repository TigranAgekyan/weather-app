import type { FC } from "react";
import {
  TiWeatherCloudy,
  TiWeatherDownpour,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherSnow,
  TiWeatherStormy,
  TiWeatherSunny,
  TiWeatherWindy,
} from "react-icons/ti";

import {
  WiHumidity
} from 'react-icons/wi'

import { FaPerson } from 'react-icons/fa6'

import type { IconType } from "react-icons";

// ─── Icon Mapping ─────────────────────────────────────────────────────────────

/**
 * Maps OpenWeatherMap icon codes to react-icons components.
 * The icon code format is e.g. "01d", "10n" — we match on the numeric prefix only,
 * since the d/n suffix only controls day vs. night appearance on OWM's own CDN.
 *
 * OWM has exactly 9 distinct icon types:
 *  01 → clear sky
 *  02 → few clouds
 *  03 → scattered clouds
 *  04 → broken / overcast clouds
 *  09 → shower rain (also used for all drizzle codes 3xx)
 *  10 → rain
 *  11 → thunderstorm
 *  13 → snow
 *  50 → atmosphere — mist, fog, smoke, haze, dust, sand, ash, squall, tornado
 */
const iconMap: Record<string, IconType> = {
  "01": TiWeatherSunny, // clear sky
  "02": TiWeatherPartlySunny, // few clouds
  "03": TiWeatherCloudy, // scattered clouds
  "04": TiWeatherCloudy, // broken / overcast clouds
  "09": TiWeatherShower, // shower rain / drizzle
  "10": TiWeatherDownpour, // rain
  "11": TiWeatherStormy, // thunderstorm
  "13": TiWeatherSnow, // snow
  "50": TiWeatherWindy, // atmosphere (mist, fog, haze, smoke, etc.)
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface WeatherCardProps {
  day: string; // Day name to display e.g. "Today", "Monday"
  icon: string; // OWM icon code e.g. "01d", "10n" — used to pick the right icon
  rainChance: number; // Probability of precipitation as a percentage (0–100)
  temperature: number;
  today: boolean; // Controls the card's size and style — today's card is taller
  description?: string; // Optional text description of the weather (not currently used)
  realFeel?: number; // Optional "feels like" temperature in °C (not currently used)
  humidity?: number; // Optional humidity percentage (not currently used)
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// Two style variants: today's card is full height and slightly more prominent,
// the other cards are slightly shorter to create a visual hierarchy
const styleStates = [
  "bg-radial from-cyan-100/10 to-cyan-800/10 backdrop-blur-2xl border-stone-500 border h-full", // today
  "bg-radial from-stone-800/10 to-stone-100/10 backdrop-blur-2xl border-stone-500 border h-[90%]", // other days
];

// ─── Component ────────────────────────────────────────────────────────────────

const WeatherCard: FC<WeatherCardProps> = ({
  day,
  icon,
  rainChance,
  temperature,
  today,
  description,
  realFeel,
  humidity,
}) => {
  // Extract the 2-digit numeric prefix from the icon code e.g. "10d" → "10"
  const WeatherIcon = iconMap[icon.slice(0, 2)] ?? TiWeatherCloudy;

  return (
    <div
      className={`flex flex-col w-[20%] justify-evenly items-center glass-inner rounded-xl p-8 gap-4 drop-shadow-xl ${
        today ? styleStates[0] : styleStates[1]
      }`}
    >
      {/* Weather icon — mapped from OWM icon code */}
      <WeatherIcon size={48} />

      {/*Day Label & Weather Description Wrapper*/}
      <div className="flex flex-col items-center">
        {/* Day label — e.g. "Today", "Monday" */}
        <span className="text-3xl font-semibold">{day}</span>
        
        {/*Weather Desciptio — e.g "Light Rain"*/}
        <span className="text-xl capitalize"> {description} </span>
      </div>

      {/*Temperature & "Feels Like" & Humidity Wrapper*/}
      <div className="flex flex-col items-center">
        {/* Temperature in °C — rounded to a whole number before being passed in */}
        <span className="text-5xl font-semibold">{temperature}°</span>
        
        {/*Humidity*/}
        <span className="text-xl flex flex-row place-content-center items-center gap-1"> <WiHumidity/> Humidity: {realFeel} </span>
        
        {/*Real Feel*/}
        <span className="text-xl flex flex-row place-content-center items-center gap-1"><FaPerson/> Feels Like: {realFeel} </span>
      </div>
      
      {/* Chance of rain as a percentage */}
      <span className="text-xl">Rain: {rainChance}%</span>
      
    </div>
  );
};

export default WeatherCard;
