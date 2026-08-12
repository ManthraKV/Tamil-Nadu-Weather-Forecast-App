import React from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  CloudRain,
  Compass,
} from 'lucide-react';
import { CurrentWeather } from '../types';
import { WeatherVisualCanvas } from './WeatherVisualCanvas';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  isDarkMode: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  isDarkMode,
}) => {
  const { city } = weather;

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800';
    if (aqi <= 100) return 'text-amber-500 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800';
    return 'text-rose-500 bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800';
  };

  return (
    <div
      id="current-weather-hero-card"
      className={`relative overflow-hidden rounded-3xl border transition-all shadow-lg ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Dynamic Animated Visual Layer */}
      <div className="absolute inset-0 h-64 sm:h-72 opacity-90 pointer-events-none">
        <WeatherVisualCanvas condition={weather.condition} isDay={weather.isDay} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[380px]">
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-xs text-white dark:text-white">
                {city.name}
              </span>
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold">
                {city.tamilName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/90 font-medium mt-1 drop-shadow-xs">
              {city.district} District • {city.region} • Elevation {city.elevationMeters}m
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/90 font-medium">
              Updated {weather.updatedAt}
            </span>
          </div>
        </div>

        {/* Hero Temperature & Condition */}
        <div className="my-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-md">
                {weather.tempC}°
              </span>
              <span className="text-xl sm:text-2xl font-medium text-sky-100/90 drop-shadow-xs">
                C
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-base sm:text-lg font-bold text-white drop-shadow-xs">
                {weather.condition}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium">
                Feels like {weather.feelsLikeC}°C
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium">
                H: {weather.maxTempC}° L: {weather.minTempC}°
              </span>
            </div>
          </div>

          {/* Quick Highlights Badge */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-white text-xs space-y-1.5 max-w-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="opacity-80">Rainfall (24h):</span>
              <span className="font-bold">{weather.rainfall24hMm} mm</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="opacity-80">Air Quality Index:</span>
              <span className="font-bold text-emerald-300">{weather.aqi} ({weather.aqiLabel})</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="opacity-80">UV Index:</span>
              <span className="font-bold">{weather.uvIndex} ({weather.uvStatus})</span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200/60'
        }`}>
          {/* Humidity */}
          <div className={`p-3.5 rounded-2xl border transition ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Humidity</span>
            </div>
            <p className="text-lg font-bold tracking-tight">{weather.humidity}%</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Dew point {weather.dewPointC}°C</p>
          </div>

          {/* Wind Speed */}
          <div className={`p-3.5 rounded-2xl border transition ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Wind className="w-4 h-4 text-sky-500" />
              <span>Wind Speed</span>
            </div>
            <p className="text-lg font-bold tracking-tight">{weather.windSpeedKmh} <span className="text-xs font-normal">km/h</span></p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Direction: {weather.windDirection}</p>
          </div>

          {/* UV Index */}
          <div className={`p-3.5 rounded-2xl border transition ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>UV Index</span>
            </div>
            <p className="text-lg font-bold tracking-tight">{weather.uvIndex} <span className="text-xs font-normal">/ 12</span></p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{weather.uvStatus}</p>
          </div>

          {/* Sunrise / Sunset */}
          <div className={`p-3.5 rounded-2xl border transition ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Sunrise className="w-4 h-4 text-amber-500" />
              <span>Sun Schedule</span>
            </div>
            <p className="text-xs font-bold">{weather.sunrise} ↑</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{weather.sunset} ↓</p>
          </div>
        </div>
      </div>
    </div>
  );
};
