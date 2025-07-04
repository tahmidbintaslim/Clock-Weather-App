# World Clock & Weather App ✨

A stunning, animated world clock and weather application built with React, TypeScript, and DaisyUI. Features glassmorphism effects, real-time weather animations, and beautiful theme-aware design.

## 🌟 Features

- 🌍 **Multi-timezone Support** - Display time for multiple cities around the world
- 🌤️ **Weather Integration** - Real-time weather data from OpenWeatherMap API
- 🎨 **Glassmorphism Design** - Beautiful glassmorphism effects with animated weather cards
- 🎭 **Weather Animations** - Dynamic visual effects based on weather conditions (rain, snow, clouds, etc.)
- 🌙 **Celestial Animations** - Animated sun and moon with glow and pulse effects
- 🎨 **Multiple Themes** - 5 beautiful DaisyUI themes (Light, Dark, Cupcake, Corporate, Synthwave)
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Clock updates every second, weather data refreshable
- ️ **Temperature Meter** - Visual temperature indicator with color coding

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4, DaisyUI 5
- **Build Tool**: Vite 7
- **Weather API**: OpenWeatherMap
- **HTTP Client**: Axios
- **UI Components**: Shadcn/ui with custom glassmorphism styling

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tahmidbintaslim/Clock-Weather-App.git
   cd world-clock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenWeatherMap API key:
   ```
   VITE_OPEN_WEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Project Structure

```
src/
├── assets/          # Weather animation components (Rain, Snow, Clouds, etc.)
├── components/      # Reusable UI components
│   └── ui/         # Shadcn/ui components with glassmorphism styling
├── lib/            # Utility functions
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles, animations, and theme-aware styling
```

## ⚙️ Configuration

### Adding New Cities

Edit the `zones` array in `src/App.tsx`:

```typescript
const zones: Zone[] = [
  { label: "Chile (Santiago)", tz: "America/Santiago", city: "Santiago,CL" },
  { label: "Bangladesh (Dhaka)", tz: "Asia/Dhaka", city: "Dhaka,BD" },
  { label: "Thailand (Bangkok)", tz: "Asia/Bangkok", city: "Bangkok,TH" },
  // Add your cities here
];
```

### Available Themes

- `light` - Clean light theme with glassmorphism
- `dark` - Dark theme with enhanced contrast
- `cupcake` - Soft pastel theme with warm tones
- `corporate` - Professional blue theme
- `synthwave` - Retro neon theme with vibrant colors

## 🌤️ Weather Features

The app displays:
- Current temperature with animated display
- Weather description with theme-aware styling
- Animated weather overlays (rain, snow, clouds, thunderstorm, mist)
- Visual temperature meter with SVG graphics
- Dynamic day/night backgrounds
- Animated celestial objects (sun/moon) with glow effects
- Glassmorphism weather cards with backdrop blur

## 🎨 Design Features

- **Glassmorphism Effects**: Beautiful frosted glass appearance on all UI elements
- **Theme-Aware Styling**: All components adapt to DaisyUI theme changes
- **Smooth Animations**: CSS keyframe animations for weather effects
- **Responsive Layout**: Mobile-first design with proper scaling
- **Accessibility**: High contrast ratios and readable text across all themes

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 💬 Support

For support or questions, please open an issue in the repository.

---

© 2025 Devsaround - Transformed with ❤️ and animated glassmorphism
