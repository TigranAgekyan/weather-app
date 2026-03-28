// ─── OpenWeatherMap API Types ─────────────────────────────────────────────────
// These interfaces model the response shape of the Forecast API:
// GET https://api.openweathermap.org/data/2.5/forecast?lat=...&lon=...

/** Geographic coordinates of a location */
export interface WeatherCoord {
  lat: number;
  lon: number;
}

/** Core atmospheric measurements for a forecast entry */
export interface WeatherMain {
  temp: number; // Current temperature in °C (when units=metric)
  feels_like: number; // Perceived temperature accounting for wind/humidity
  temp_min: number; // Minimum temperature at the time of the forecast
  temp_max: number; // Maximum temperature at the time of the forecast
  pressure: number; // Atmospheric pressure at sea level (hPa)
  sea_level: number; // Atmospheric pressure at sea level (hPa)
  grnd_level: number; // Atmospheric pressure at ground level (hPa)
  humidity: number; // Humidity percentage (0–100)
  temp_kf: number; // Internal API parameter for temperature correction
}

/** Describes the general weather condition (e.g. "Rain", "Clouds") */
export interface WeatherCondition {
  id: number; // Weather condition code (e.g. 800 = clear sky)
  main: string; // Group name e.g. "Rain", "Snow", "Clouds"
  description: string; // Human-readable description e.g. "light rain"
  icon: string; // Icon code used to build the icon URL e.g. "10d"
}

/** Cloud coverage data */
export interface WeatherClouds {
  all: number; // Cloudiness percentage (0–100)
}

/** Wind measurements */
export interface WeatherWind {
  speed: number; // Wind speed in m/s (metric)
  deg: number; // Wind direction in degrees (meteorological)
  gust: number; // Wind gust speed in m/s
}

/**
 * Precipitation volume over the last 3 hours.
 * Only present on a ForecastItem when it is actually raining.
 */
export interface WeatherRain {
  "3h": number; // Rain volume in mm — key is quoted because it starts with a number
}

/** Part of day indicator returned per forecast entry */
export interface WeatherSys {
  pod: "d" | "n"; // "d" = daytime, "n" = night-time
}

/**
 * A single forecast entry representing a 3-hour window.
 * The full API response contains 40 of these, covering 5 days.
 */
export interface ForecastItem {
  dt: number; // Unix timestamp (seconds) of the forecast time
  main: WeatherMain;
  weather: WeatherCondition[]; // Array, but typically only one condition is returned
  clouds: WeatherClouds;
  wind: WeatherWind;
  visibility: number; // Max visibility in metres (capped at 10,000)
  pop: number; // Probability of precipitation (0–1, multiply by 100 for %)
  rain?: WeatherRain; // Optional — only present when precipitation > 0
  sys: WeatherSys;
  dt_txt: string; // Human-readable datetime string e.g. "2026-03-28 18:00:00"
}

/** Metadata about the city the forecast was requested for */
export interface WeatherCity {
  id: number;
  name: string;
  coord: WeatherCoord;
  country: string; // ISO 3166 country code e.g. "GB", "US"
  population: number;
  timezone: number; // Timezone offset from UTC in seconds
  sunrise: number; // Unix timestamp of sunrise
  sunset: number; // Unix timestamp of sunset
}

/** Top-level shape of the Forecast API response */
export interface WeatherData {
  cod: string; // Response status code e.g. "200"
  message: number; // Internal API parameter, can be ignored
  cnt: number; // Number of forecast entries returned (typically 40)
  list: ForecastItem[]; // The forecast entries, in 3-hour intervals
  city: WeatherCity;
}
