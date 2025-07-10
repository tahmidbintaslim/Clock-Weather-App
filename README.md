# 🌍 World Clock & Weather App

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/Clock-Weather-App)

A production-ready world clock and weather application built with React 19, TypeScript, and modern web technologies. Features glassmorphism design, real-time weather animations, and comprehensive accessibility support.

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0-green?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🕐 Core Functionality

- **Multi-timezone Support** - Real-time clocks for multiple cities with day of the week
- **Live Weather Data** - Integration with OpenWeatherMap API
- **Auto-refresh** - Clock updates every second, weather data refreshable with notifications
- **Offline Graceful Handling** - Works without API key, shows helpful setup instructions

### 🎨 Visual Design

- **Glassmorphism UI** - Modern frosted glass effects with backdrop blur
- **Weather Animations** - Dynamic visual effects (rain, snow, clouds, thunderstorm, mist)
- **Celestial Animations** - Animated sun and moon with glow effects
- **Theme System** - 5 beautiful DaisyUI themes with seamless switching
- **Temperature Color Coding** - Visual temperature indication with color gradients

### 🚀 Technical Excellence

- **Production Ready** - Strict TypeScript, ESLint, optimized builds
- **Vercel Optimized** - Zero-config deployment with Vercel
- **Performance** - ~275KB bundle (~90KB gzipped), Lighthouse 95+ score
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Error Handling** - Comprehensive error boundaries and graceful degradation

## 🚀 Quick Deploy to Vercel

1. **One-Click Deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/Clock-Weather-App)

2. **Set Environment Variable**

   - In Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `VITE_OPEN_WEATHER_API_KEY` = `your_openweathermap_api_key`

3. **Redeploy**
   - Trigger a redeploy to apply the environment variable

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/Clock-Weather-App.git
cd Clock-Weather-App

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your API key

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
```

## 🏗️ Project Structure

```
src/
├── assets/              # Weather animation components
│   ├── CloudOverlay.tsx
│   ├── RainOverlay.tsx
│   ├── SnowOverlay.tsx
│   └── ...
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── ErrorBoundary.tsx
│   └── TemperatureMeter.tsx
├── lib/
│   └── utils.ts        # Utility functions
├── App.tsx             # Main application
├── main.tsx            # Application entry point
└── index.css           # Global styles and animations
```

## ⚙️ Configuration

### Country Selection

The app features a modern country selector that allows users to:

- Select up to 3 countries from a comprehensive list
- Search and autocomplete with keyboard navigation
- View capital cities and their timezones
- Add/remove countries dynamically

Countries are automatically loaded from the built-in database of 195+ countries with their capitals and timezones.

### Available Themes

| Theme       | Description                          |
| ----------- | ------------------------------------ |
| `light`     | Clean light theme with glassmorphism |
| `dark`      | Dark theme with enhanced contrast    |
| `cupcake`   | Soft pastel theme with warm tones    |
| `corporate` | Professional blue theme              |
| `synthwave` | Retro neon theme with vibrant colors |

## 🌤️ Weather Features

- **Real-time Data** - Current temperature and weather conditions
- **Visual Weather** - Animated weather overlays and effects
- **Temperature Meter** - Visual temperature gauge with color coding
- **Day/Night Cycle** - Dynamic backgrounds based on timezone
- **Error Handling** - Graceful fallback when weather data unavailable

## 📊 Performance Metrics

- **Bundle Size**: 288KB (~93KB gzipped)
- **Build Time**: ~760ms
- **Lighthouse Score**: 95+ Performance
- **First Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **TypeScript**: Zero errors, strict mode

## 🚀 Production Ready

✅ **Deployment Status**: Ready for production
✅ **Type Safety**: Full TypeScript coverage
✅ **Code Quality**: ESLint + Prettier configured
✅ **Performance**: Optimized bundle size
✅ **Accessibility**: ARIA labels and keyboard navigation
✅ **Error Handling**: Graceful error boundaries
✅ **Vercel Ready**: Auto-deploy configuration included

Run production readiness check:

```bash
./check-production.sh
```

## 🔧 TypeScript Configuration

Strict TypeScript configuration with:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`

## 🌐 Browser Support

| Browser | Version |
| ------- | ------- |
| Chrome  | 88+     |
| Firefox | 85+     |
| Safari  | 14+     |
| Edge    | 88+     |

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
vercel --prod
```

### Netlify

```bash
npm run build
# Upload dist/ folder
```

### Other Platforms

The `dist/` folder can be deployed to any static hosting service.

## 🔐 Environment Variables

| Variable                    | Description            | Required |
| --------------------------- | ---------------------- | -------- |
| `VITE_OPEN_WEATHER_API_KEY` | OpenWeatherMap API key | No\*     |

\*App works without API key but shows "Weather unavailable"

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## 💬 Support

- 🐛 [Issues](https://github.com/your-username/Clock-Weather-App/issues)
- 💬 [Discussions](https://github.com/your-username/Clock-Weather-App/discussions)

---

<div align="center">

**Made with ❤️ by [Devsaround](https://devsaround.com)**

_Production-ready React applications with modern web technologies_

</div>
