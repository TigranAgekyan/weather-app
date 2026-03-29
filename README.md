# SkyCast — 5-Day Weather Forecast App

A clean, responsive weather application built with React, TypeScript, and Tailwind CSS. Search any city in the world and instantly view a 5-day forecast with temperature, humidity, wind speed, feels-like temperature, and precipitation chance — all powered by the OpenWeatherMap API.

**[Live Demo](https://weather-app-tigran.netlify.app)**

---

## Features

- **City Search** — Autocomplete city suggestions powered by the OpenWeatherMap Geocoding API with 500ms debounce to minimize API calls
- **5-Day Forecast** — One representative forecast card per day, selected by highest precipitation probability (worst-case rain chance, not the midnight slot)
- **Metric / Imperial Toggle** — Switch between °C / km/h and °F / mph with a smooth animated transition
- **Detailed Cards** — Each card displays temperature, feels-like temperature, humidity, wind speed, weather description, and rain chance
- **Animated UI** — Page-entry animations and search overlay powered by Framer Motion
- **Persistent Last Search** — Last searched city is stored in a cookie (7-day expiry) and pre-filled on next visit
- **Loading Skeletons** — Placeholder cards with animated spinners appear while data is fetching
- **Fully Responsive** — Adapts from mobile to desktop with a fluid card layout

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://motion.dev/) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Cookie Storage | [js-cookie](https://github.com/js-cookie/js-cookie) |
| Weather Data | [OpenWeatherMap API](https://openweathermap.org/api) |
| Deployment | [Netlify](https://www.netlify.com/) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenWeatherMap API key](https://openweathermap.org/appid) (free tier is sufficient)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TigranAgekyan/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create your environment file**

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and add your key:

   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server with HMR |
| `npm run build` | Type-check and compile a production build into `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint across all source files |

---

## Project Structure

```
weather-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── wp8997310-1404774826.jpg   # Background image
│   ├── components/
│   │   ├── FWeatherCard.tsx           # Individual forecast card
│   │   └── SLoadingAnimation.tsx      # Animated loading placeholder
│   ├── App.tsx                        # Root component — search, state, layout
│   ├── types.ts                       # OpenWeatherMap API response types
│   ├── index.css                      # Global styles & Tailwind directives
│   └── main.tsx                       # React entry point
├── index.html
├── netlify.toml                       # Netlify build & redirect config
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## How It Works

### City Search (Geocoding)
When the user types in the search box, a debounced effect fires after 500ms and calls the OpenWeatherMap [Geocoding API](https://openweathermap.org/api/geocoding-api) to retrieve up to 5 matching cities. Selecting a city from the dropdown stores its coordinates and triggers the forecast fetch.

### Forecast Aggregation
The [5-Day Forecast API](https://openweathermap.org/forecast5) returns 40 entries at 3-hour intervals. The app reduces these to 5 daily cards by grouping entries by calendar date and keeping the one with the **highest probability of precipitation** — so the rain chance shown always reflects the worst case for that day.

### Unit Toggle
The unit preference (`metric` / `imperial`) is passed directly to the OpenWeatherMap API's `units` parameter, so all values (temperature, wind speed) are returned in the correct unit without any client-side conversion.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_WEATHER_API_KEY` | Your OpenWeatherMap API key. Required for geocoding and forecast requests. |

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Deployment

The app is deployed on **Netlify**. The `netlify.toml` at the project root configures the build command, publish directory, and an SPA redirect rule so that client-side routing works correctly on direct URL loads.

To deploy your own instance:

1. Fork this repository
2. Connect it to a new Netlify site
3. Add `VITE_WEATHER_API_KEY` as an environment variable in the Netlify dashboard
4. Netlify will automatically build and deploy on every push to `master`

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgements

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Background photograph sourced from [Wallpaper Cave](https://wallpapercave.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/) (Typicons & Weather Icons sets)
