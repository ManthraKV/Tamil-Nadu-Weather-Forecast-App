import React, { useState } from 'react';
import { Clock, CloudRain, Wind, Droplets, Sun, Moon, Cloud, CloudLightning, CloudFog } from 'lucide-react';
import { HourlyForecast } from '../types';

interface HourlyForecastViewProps {
  hourly: HourlyForecast[];
  isDarkMode: boolean;
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({
  hourly,
  isDarkMode,
}) => {
  const [activeMetric, setActiveMetric] = useState<'temp' | 'rain' | 'wind' | 'humidity'>('temp');

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500 animate-pulse-slow" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'cloud-rain':
      case 'cloud-drizzle':
      case 'cloud-rain-wind':
        return <CloudRain className="w-5 h-5 text-sky-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-5 h-5 text-amber-400" />;
      case 'cloud-fog':
        return <CloudFog className="w-5 h-5 text-slate-400" />;
      default:
        return <Cloud className="w-5 h-5 text-sky-400" />;
    }
  };

  // Find max & min temp to compute relative height bar
  const maxTemp = Math.max(...hourly.map((h) => h.tempC));
  const minTemp = Math.min(...hourly.map((h) => h.tempC));
  const tempRange = Math.max(1, maxTemp - minTemp);

  return (
    <div
      id="hourly-forecast-timeline"
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          <h3 className="font-semibold text-lg tracking-tight">Hourly Forecast (Next 24 Hours)</h3>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeMetric === 'temp'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Temperature (°C)
          </button>
          <button
            onClick={() => setActiveMetric('rain')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeMetric === 'rain'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Rainfall (%)
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeMetric === 'wind'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Wind (km/h)
          </button>
        </div>
      </div>

      {/* Scrollable Hourly Timeline */}
      <div className="overflow-x-auto pb-3 pt-2 no-scrollbar">
        <div className="flex items-end gap-3 min-w-max px-1">
          {hourly.map((h, idx) => {
            const heightPercent = Math.round(((h.tempC - minTemp) / tempRange) * 50) + 30;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl border transition-all hover:scale-105 w-20 ${
                  idx === 0
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {/* Time */}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {idx === 0 ? 'Now' : h.time.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-light">
                  {h.time.split(' ')[1]}
                </span>

                {/* Weather Icon */}
                <div className="my-2">{getWeatherIcon(h.icon)}</div>

                {/* Dynamic Metric Display */}
                {activeMetric === 'temp' && (
                  <div className="text-center">
                    <span className="font-extrabold text-sm block">{h.tempC}°</span>
                    {/* Visual height indicator bar */}
                    <div className="w-1.5 bg-sky-200 dark:bg-sky-900 rounded-full mx-auto my-1.5 h-10 flex items-end">
                      <div
                        className="w-full bg-sky-500 rounded-full transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'rain' && (
                  <div className="text-center my-1">
                    <span className="font-bold text-xs text-sky-600 dark:text-sky-400 block">
                      {h.rainProbability}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {h.precipitationMm}mm
                    </span>
                  </div>
                )}

                {activeMetric === 'wind' && (
                  <div className="text-center my-1">
                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 block">
                      {h.windSpeedKmh}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      km/h
                    </span>
                  </div>
                )}

                {/* Rain Probability Pill at bottom */}
                <div className="flex items-center gap-0.5 text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1">
                  <CloudRain className="w-3 h-3" />
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
