import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  CloudRain,
  ShieldCheck,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { CurrentWeather, AppLanguage } from '../types';
import { WeatherVisualCanvas } from './WeatherVisualCanvas';
import { TRANSLATIONS, CONDITION_TRANSLATIONS, REGION_TRANSLATIONS } from '../utils/translations';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  isDarkMode,
  lang = 'en',
}) => {
  const { city } = weather;
  const t = TRANSLATIONS[lang];

  // Helper for AQI color badge
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700';
    if (aqi <= 100) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-700';
  };

  // Helper for UV color badge
  const getUvColor = (uv: number) => {
    if (uv <= 3) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700';
    if (uv <= 7) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-700';
  };

  return (
    <div
      id="current-weather-hero-card"
      className={`relative overflow-hidden rounded-3xl border transition-all shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800/60 text-slate-100'
          : 'bg-white/75 border-amber-200/50 text-slate-800'
      }`}
    >
      {/* Dynamic Animated Canvas Backdrop */}
      <div className="absolute inset-0 h-48 sm:h-56 opacity-60 pointer-events-none">
        <WeatherVisualCanvas condition={weather.condition} isDay={weather.isDay} />
      </div>

      {/* Content Container with compact padding and zero dead space */}
      <div className="relative z-10 p-3.5 sm:p-4.5 flex flex-col gap-3">
        {/* Top Header Row: Location & Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xl sm:text-2xl font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {lang === 'ta' ? city.tamilName : city.name}
            </span>
            {lang === 'ta' ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/40">
                {city.name}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-400/40">
                {city.district} District
              </span>
            )}
            <span className={`text-xs font-semibold ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              • {REGION_TRANSLATIONS[city.region]?.[lang] || city.region} • {lang === 'ta' ? `கடல்மட்டம் ${city.elevationMeters} மீ` : `Elevation ${city.elevationMeters}m`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-md ${
              isDarkMode ? 'bg-black/40 text-slate-200 border border-slate-700' : 'bg-white/90 text-slate-800 border border-slate-300 shadow-2xs'
            }`}>
              {t.updated} {weather.updatedAt}
            </span>
          </div>
        </div>

        {/* Core Weather & Highlights Row: Zero empty space, large prominent stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          {/* Main Temperature & Condition Block (5 cols) */}
          <div className={`md:col-span-5 p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between backdrop-blur-md ${
            isDarkMode
              ? 'bg-slate-950/40 border-slate-800/80'
              : 'bg-white/80 border-slate-200/90 shadow-2xs'
          }`}>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-5xl sm:text-6xl font-black tracking-tighter ${
                  isDarkMode
                    ? weather.tempC > 32 ? 'text-amber-300' : weather.tempC < 25 ? 'text-cyan-200' : 'text-white'
                    : weather.tempC > 32 ? 'text-amber-950' : weather.tempC < 25 ? 'text-indigo-950' : 'text-slate-900'
                }`}>
                  {weather.tempC}°
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-500 dark:text-slate-400">
                  C
                </span>
              </div>
              <div className="text-right">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-xl shadow-2xs ${
                  isDarkMode ? 'bg-sky-950/80 text-sky-200 border border-sky-800' : 'bg-sky-50 text-sky-900 border border-sky-200'
                }`}>
                  {CONDITION_TRANSLATIONS[weather.condition]?.[lang] || weather.condition}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/60 text-xs">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.feelsLike}</span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {weather.feelsLikeC}°C
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.highLow}</span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {weather.maxTempC}° / {weather.minTempC}°
                </span>
              </div>
            </div>
          </div>

          {/* Prominent High-Impact 3 Key Highlight Blocks (7 cols): Rainfall, Air Quality, UV Index with Large Sizing */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Rainfall 24h */}
            <div className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col justify-between backdrop-blur-md transition hover:scale-[1.01] ${
              isDarkMode
                ? 'bg-slate-950/40 border-slate-800/80 text-white'
                : 'bg-white/80 border-slate-200/90 text-slate-900 shadow-2xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{t.rainfall24h}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                  24h
                </span>
              </div>
              <div className="my-1.5">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-sky-600 dark:text-sky-300">
                  {weather.rainfall24hMm} <span className="text-sm font-bold text-slate-500 dark:text-slate-400">mm</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                {weather.rainfall24hMm > 0 ? (lang === 'ta' ? 'மழைப்பொழிவு பதிவாகியுள்ளது' : 'Precipitation logged') : (lang === 'ta' ? 'மழையற்ற தெளிவான வானிலை' : 'No recent precipitation')}
              </p>
            </div>

            {/* 2. Air Quality Index (AQI) */}
            <div className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col justify-between backdrop-blur-md transition hover:scale-[1.01] ${
              isDarkMode
                ? 'bg-slate-950/40 border-slate-800/80 text-white'
                : 'bg-white/80 border-slate-200/90 text-slate-900 shadow-2xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t.airQuality}</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold border ${getAqiColor(weather.aqi)}`}>
                  {weather.aqiLabel}
                </span>
              </div>
              <div className="my-1.5">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-300">
                  {weather.aqi} <span className="text-sm font-bold text-slate-500 dark:text-slate-400">AQI</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                {lang === 'ta' ? 'சுவாச தூய்மை குறியீடு' : 'Air Purity Standard'}
              </p>
            </div>

            {/* 3. UV Index */}
            <div className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col justify-between backdrop-blur-md transition hover:scale-[1.01] ${
              isDarkMode
                ? 'bg-slate-950/40 border-slate-800/80 text-white'
                : 'bg-white/80 border-slate-200/90 text-slate-900 shadow-2xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t.uvIndex}</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold border ${getUvColor(weather.uvIndex)}`}>
                  {weather.uvStatus}
                </span>
              </div>
              <div className="my-1.5">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-300">
                  {weather.uvIndex} <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/ 12</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                {lang === 'ta' ? 'சூரிய கதிர்வீச்சு நிலை' : 'Solar Radiation Level'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Secondary Metrics Row: Compact 4 columns */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-2 border-t ${
          isDarkMode ? 'border-slate-800/80' : 'border-slate-200/70'
        }`}>
          {/* Humidity & Dew Point */}
          <div className={`p-2.5 rounded-xl border transition ${
            isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-white' : 'bg-white/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs mb-0.5 font-semibold">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.humidity}</span>
            </div>
            <p className="text-base sm:text-lg font-black tracking-tight">{weather.humidity}%</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
              {lang === 'ta' ? `பனிப்புள்ளி ${weather.dewPointC}°C` : `Dew pt: ${weather.dewPointC}°C`}
            </p>
          </div>

          {/* Wind Speed & Direction */}
          <div className={`p-2.5 rounded-xl border transition ${
            isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-white' : 'bg-white/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs mb-0.5 font-semibold">
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.windSpeed}</span>
            </div>
            <p className="text-base sm:text-lg font-black tracking-tight">
              {weather.windSpeedKmh} <span className="text-xs font-normal">{lang === 'ta' ? 'கி.மீ/ம' : 'km/h'}</span>
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
              {lang === 'ta' ? `திசை: ${weather.windDirection}` : `Wind: ${weather.windDirection}`}
            </p>
          </div>

          {/* Atmospheric Pressure */}
          <div className={`p-2.5 rounded-xl border transition ${
            isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-white' : 'bg-white/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs mb-0.5 font-semibold">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'ta' ? 'வளிமண்டல அழுத்தம்' : 'Pressure'}</span>
            </div>
            <p className="text-base sm:text-lg font-black tracking-tight">1012 <span className="text-xs font-normal">hPa</span></p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
              {lang === 'ta' ? 'நிலையான அழுத்தம்' : 'Stable atmospheric'}
            </p>
          </div>

          {/* Sun Cycle Times */}
          <div className={`p-2.5 rounded-xl border transition ${
            isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-white' : 'bg-white/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs mb-0.5 font-semibold">
              <Sunrise className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'ta' ? 'சூரிய உதயம் / மறைவு' : 'Sun Timings'}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-black">
              <span>↑ {weather.sunrise}</span>
              <span className="text-slate-600 dark:text-slate-400">↓ {weather.sunset}</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
              {lang === 'ta' ? 'கடலோர சூரிய அட்டவணை' : 'Coastline cycle'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
