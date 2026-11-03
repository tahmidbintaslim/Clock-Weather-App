# Contributing

Thanks for helping. This is a small personal project, so focused changes are the easiest to review.

## Before you start

- For a bug, open a [bug report](https://github.com/tahmidbintaslim/Clock-Weather-App/issues/new?template=bug_report.yml). For a new feature, open a [feature request](https://github.com/tahmidbintaslim/Clock-Weather-App/issues/new?template=feature_request.yml) first so we can agree on the approach.
- The [Status and roadmap](README.md#status-and-roadmap) section lists the known limits and likely next steps. Those are good places to start.
- Security problems go through [SECURITY.md](SECURITY.md), not a public issue.

## Set up

You need Node.js 22.18 or later (`.nvmrc` pins 22) and npm 10 or later.

```bash
git clone https://github.com/tahmidbintaslim/Clock-Weather-App.git
cd Clock-Weather-App
npm ci
cp .env.example .env.local   # optional: set OPENWEATHER_API_KEY for live weather
npm run dev                  # http://localhost:5173, including /api/weather
```

Without a key the clocks still run and each card shows a setup hint, so most UI work does not need one.

## Checks

Run these before you open a pull request. CI runs the same steps.

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## Rules to keep

- The OpenWeather key is read on the server only (`api/weather.ts` and the Vite dev and preview servers). Never give it a `VITE_` prefix or call `api.openweathermap.org` from `src/`. CI fails the build if either shows up in `dist/`.
- If you add a city to `src/data/countries.ts`, add the same `city` value to `ALLOWED_CITIES` in `api/weather.ts`. A test checks that the two lists match.
- Keep pull requests to one change, and add or update tests in `tests/` when behavior changes.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for messages, for example `fix(ui): ...` or `feat(api): ...`.

## Contact

Questions that do not fit an issue can go to tahmidbintaslimrafi@gmail.com.
