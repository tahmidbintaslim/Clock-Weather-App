# Deployment Guide

## Prerequisites for Deployment

- Node.js 18+
- npm or yarn
- OpenWeatherMap API key

## Environment Setup

1. **Create Production Environment File**

   ```bash
   cp .env.example .env.production
   ```

2. **Configure Production Variables**
   ```env
   VITE_OPEN_WEATHER_API_KEY=your_production_api_key
   ```

## Deployment Options

### 1. Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `VITE_OPEN_WEATHER_API_KEY=your_api_key`

### 2. Netlify

1. **Build Project**

   ```bash
   npm run build
   ```

2. **Deploy dist folder** to Netlify

3. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_OPEN_WEATHER_API_KEY=your_api_key`

### 3. GitHub Pages

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**

   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### 4. Docker Deployment

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   docker build -t world-clock-app .
   docker run -p 80:80 world-clock-app
   ```

## Production Checklist

- [ ] Environment variables configured
- [ ] Build process tested (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] All features tested in production build
- [ ] Error boundaries implemented
- [ ] Performance optimized
- [ ] Security headers configured (if using custom server)
- [ ] API keys secured
- [ ] HTTPS enabled

## Performance Optimization

The app is already optimized with:

- Tree shaking
- Code splitting
- Optimized bundle size (~275KB, ~90KB gzipped)
- Efficient React re-renders
- Lazy loading where applicable

## Monitoring

Consider adding:

- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Web Vitals)
- Uptime monitoring
