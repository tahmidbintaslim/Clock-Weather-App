# World Clock & Weather

**Live demo (working demo):** [clock-weather-app-six.vercel.app](https://clock-weather-app-six.vercel.app/)

Local time and current weather for up to three cities, side by side. Each city gets a card with an animated sky: day or night from that city's sunrise and sunset, plus rain, snow, cloud, mist or thunderstorm overlays for the current conditions. Built with React 19, TypeScript, Vite and Tailwind CSS with daisyUI. Weather data comes from [OpenWeather](https://openweathermap.org/) through a small server function, so the API key never reaches the browser.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tahmidbintaslim/clock-weather-app&env=OPENWEATHER_API_KEY&envDescription=OpenWeather%20API%20key%2C%20read%20only%20by%20the%20api%2Fweather%20function&envLink=https://openweathermap.org/api)

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-green?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## Features

- Clocks for up to 3 cities, updated every second, with the weekday and the UTC offset. Offsets that are not whole hours show correctly, such as GMT+5:30 (New Delhi) and GMT+4:30 (Kabul).
- Search a list of 87 countries, one city each (mostly capitals). Arrow keys and Enter pick a result.
- Your cities are saved in the browser and in the page URL, so a reload keeps them and you can share the link (see [Sharing a set of cities](#sharing-a-set-of-cities)).
- Current temperature, the "feels like" temperature and the conditions for each city, with a thermometer and a gauge.
- Day or night for each city from OpenWeather's sunrise and sunset times. Until weather loads, 06:00 to 18:00 local time counts as day.
- Overlays for rain, drizzle, thunderstorm, snow, clouds, mist, fog, haze and smoke; sun rays on a clear day and stars on a clear night.
- A Refresh button on each card.
- 5 daisyUI themes (light, dark, cupcake, corporate, synthwave). Your choice is saved in the browser.
- Without an API key the clocks still run, and each weather card shows a setup hint.

## How the API key stays private

- `api/weather.ts` is a Vercel function. It reads `OPENWEATHER_API_KEY`, calls OpenWeather, and returns only the fields the app shows. The variable has no `VITE_` prefix, so Vite never copies it into the JavaScript bundle.
- The function accepts one query parameter, `q`, and only for the 87 cities the picker offers, so it can't be used as a general OpenWeather proxy.
- Successful answers carry `Cache-Control: s-maxage=600`, so Vercel's CDN answers repeat requests for 10 minutes and each city costs about one OpenWeather call per 10 minutes per CDN region.
- The browser only calls `/api/weather?q=<city>`, never OpenWeather itself.

## Deploy to Vercel

1. Click **Deploy with Vercel** above, or import the repository in Vercel. Vercel detects Vite and serves `api/weather.ts` as a function, so no `vercel.json` is needed.
2. Set `OPENWEATHER_API_KEY` in Project Settings > Environment Variables. A free key is available at [openweathermap.org/api](https://openweathermap.org/api).
3. Redeploy so the function picks up the variable.

If you deployed an earlier version of this app, delete the old `VITE_OPEN_WEATHER_API_KEY` variable and rotate that key in your OpenWeather account. Earlier builds copied it into the public bundle.

## Local development

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 7). `npm test` runs TypeScript tests with Node's built-in type stripping, which needs Node.js 22.18 or later.
- npm
- An OpenWeather API key (optional: without one, the weather cards show a setup hint)

### Installation

```bash
git clone https://github.com/tahmidbintaslim/clock-weather-app.git
cd clock-weather-app
npm install

# Put your key in OPENWEATHER_API_KEY in .env.local (git ignores it)
cp .env.example .env.local

npm run dev
```

`npm run dev` and `npm run preview` serve `/api/weather` from the same handler Vercel deploys, so you don't need the Vercel CLI.

### Available scripts

```bash
npm run dev          # Development server, including /api/weather
npm run build        # Type-check and build to dist/
npm run preview      # Serve the production build, including /api/weather
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript checks for the app and the tests
npm test             # Unit tests (Node's built-in test runner)
```

## Sharing a set of cities

The address bar always holds the cities on screen, for example:

```
https://clock-weather-app-six.vercel.app/?cities=Dhaka,BD;Bangkok,TH;Santiago,CL
```

Each entry is a `city` value from `src/data/countries.ts`, separated by semicolons. Matching ignores case, unknown entries are skipped, and only the first 3 known cities are used. A link takes priority over the list saved in the browser, and then becomes the saved list.

## Project structure

```
api/
└── weather.ts          # Vercel function: OpenWeather proxy, the key stays on the server
src/
├── assets/             # Weather overlay components
│   ├── CloudOverlay.tsx
│   ├── RainOverlay.tsx
│   ├── SnowOverlay.tsx
│   └── ...
├── components/         # City picker, temperature meter, error boundary
│   └── ui/             # shadcn/ui components
├── data/
│   └── countries.ts    # The 87 cities and their time zones
├── lib/
│   ├── cities.ts       # Saved cities and ?cities= links
│   ├── time.ts         # UTC offset and day/night helpers
│   ├── weather.ts      # Browser client for /api/weather
│   └── utils.ts        # Utility functions
├── App.tsx             # Main application
├── main.tsx            # Application entry point
└── index.css           # Global styles and animations
tests/                  # Unit tests for the function and the helpers
```

## Environment variables

| Variable              | Read by                                                              | Required |
| --------------------- | -------------------------------------------------------------------- | -------- |
| `OPENWEATHER_API_KEY` | The server only: `api/weather.ts` and the Vite dev and preview servers | No\*     |

\*Without it the clocks work and the weather cards show "Weather unavailable" with a setup hint.

## Available themes

| Theme       | Description                          |
| ----------- | ------------------------------------ |
| `light`     | Light theme with glassmorphism       |
| `dark`      | Dark theme                           |
| `cupcake`   | Soft pastel theme                    |
| `corporate` | Blue business theme                  |
| `synthwave` | Retro neon theme                     |

## Bundle size

`npm run build` produces a 253 kB JavaScript bundle (79 kB gzipped).

## TypeScript configuration

Strict TypeScript configuration with:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`

## Browser support

The build uses Vite 7's default browser target: Chrome and Edge 107+, Firefox 104+ and Safari 16+.

## Other hosts

`dist/` is a static site, but the weather needs `/api/weather`. On a host other than Vercel, port `api/weather.ts` (a standard `Request` to `Response` handler) to that host's functions; otherwise the cards show "Weather unavailable".

## Known limits

- Up to 3 cities, temperatures in Celsius only, 12-hour clock.
- Current conditions only, no forecast. A copy cached by the CDN can be up to about 11 minutes old.
- The animations do not yet respect `prefers-reduced-motion`, and the city search is not yet an ARIA combobox.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- [Issues](https://github.com/tahmidbintaslim/clock-weather-app/issues)

---

<div align="center">

**Made with ❤️ by [Devsaround](https://devsaround.com)**

</div>
