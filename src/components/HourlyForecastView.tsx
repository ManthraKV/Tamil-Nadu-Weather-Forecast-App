import React, { useState } from 'react';
import { Clock, CloudRain, Wind, Sun, Moon, Cloud, CloudLightning, CloudFog } from 'lucide-react';
import { HourlyForecast, AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HourlyForecastViewProps {
  hourly: HourlyForecast[];
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({
  hourly,
  isDarkMode,
  lang = 'en',
}) => {
  const [activeMetric, setActiveMetric] = useState<'temp' | 'rain' | 'wind'>('temp');
  const t = TRANSLATIONS[lang];

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'moon':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'cloud-rain':
      case 'cloud-drizzle':
      case 'cloud-rain-wind':
        return <CloudRain className="w-4 h-4 text-sky-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-4 h-4 text-amber-400" />;
      case 'cloud-fog':
        return <CloudFog className="w-4 h-4 text-slate-400" />;
      default:
        return <Cloud className="w-4 h-4 text-sky-400" />;
    }
  };

  // Sample 12 key hourly timepoints (every 2 hours across 24h) to fit seamlessly without horizontal scroll
  const displayedHours = hourly.filter((_, idx) => idx % 2 === 0).slice(0, 12);

  // Find max & min temp to compute relative height bar
  const maxTemp = Math.max(...displayedHours.map((h) => h.tempC));
  const minTemp = Math.min(...displayedHours.map((h) => h.tempC));
  const tempRange = Math.max(1, maxTemp - minTemp);

  return (
    <div
      id="hourly-forecast-timeline"
      className={`rounded-3xl border p-4 sm:p-5 transition-all shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/50 border-slate-800/60 text-slate-100'
          : 'bg-white/55 border-amber-200/40 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" />
          <h3 className="font-bold text-base sm:text-lg tracking-tight">
            {t.hourlyTitle}
          </h3>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-0.5 rounded-xl backdrop-blur-xs">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
              activeMetric === 'temp'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ta' ? 'வெப்பநிலை (°C)' : 'Temp (°C)'}
          </button>
          <button
            onClick={() => setActiveMetric('rain')}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
              activeMetric === 'rain'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ta' ? 'மழை (%)' : 'Rain (%)'}
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
              activeMetric === 'wind'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ta' ? 'காற்று (கிமீ/ம)' : 'Wind (km/h)'}
          </button>
        </div>
      </div>

      {/* Non-scrolling Compact Responsive Grid */}
      <div className="w-full">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
          {displayedHours.map((h, idx) => {
            const heightPercent = Math.round(((h.tempC - minTemp) / tempRange) * 40) + 30;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between py-2 px-1 rounded-xl border transition-all ${
                  idx === 0
                    ? 'bg-sky-500/15 border-sky-400/50 shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70'
                    : 'bg-white/40 border-slate-200/50 hover:bg-white/70'
                }`}
              >
                {/* Time with smaller fonts */}
                <div className="text-center">
                  <span className="text-[10px] sm:text-[11px] font-bold block leading-none text-slate-700 dark:text-slate-300">
                    {idx === 0 ? t.now : h.time.split(' ')[0]}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    {idx === 0 ? '' : h.time.split(' ')[1]}
                  </span>
                </div>

                {/* Compact Weather Icon */}
                <div className="my-1.5">{getWeatherIcon(h.icon)}</div>

                {/* Metric Display */}
                {activeMetric === 'temp' && (
                  <div className="text-center w-full px-0.5">
                    <span className="font-black text-xs block leading-tight">{h.tempC}°</span>
                    {/* Visual mini bar */}
                    <div className="w-1 bg-sky-200/50 dark:bg-sky-900/50 rounded-full mx-auto my-1 h-7 flex items-end">
                      <div
                        className="w-full bg-sky-500 rounded-full transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'rain' && (
                  <div className="text-center my-1">
                    <span className="font-black text-[11px] text-sky-600 dark:text-sky-400 block leading-tight">
                      {h.rainProbability}%
                    </span>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400 block">
                      {h.precipitationMm}mm
                    </span>
                  </div>
                )}

                {activeMetric === 'wind' && (
                  <div className="text-center my-1">
                    <span className="font-black text-[11px] text-indigo-600 dark:text-indigo-400 block leading-tight">
                      {h.windSpeedKmh}
                    </span>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400 block">
                      km/h
                    </span>
                  </div>
                )}

                {/* Compact Rain Probability */}
                <div className="flex items-center gap-0.5 text-[9px] text-sky-600 dark:text-sky-400 font-bold mt-0.5">
                  <CloudRain className="w-2.5 h-2.5" />
                  <span>{h.rainProbability}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
