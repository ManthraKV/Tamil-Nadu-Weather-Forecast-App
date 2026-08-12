import React, { useState } from 'react';
import { Calendar, CloudRain, Sun, Moon, Cloud, CloudLightning, ChevronDown, ChevronUp, Wind, Droplets, Sunrise, Sunset, AlertTriangle } from 'lucide-react';
import { DailyForecast } from '../types';

interface FiveDayDashboardViewProps {
  daily: DailyForecast[];
  isDarkMode: boolean;
}

export const FiveDayDashboardView: React.FC<FiveDayDashboardViewProps> = ({
  daily,
  isDarkMode,
}) => {
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(0);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Thunderstorm')) return <CloudLightning className="w-6 h-6 text-amber-500" />;
    if (condition.includes('Rain')) return <CloudRain className="w-6 h-6 text-sky-500" />;
    if (condition === 'Clear') return <Sun className="w-6 h-6 text-amber-400" />;
    return <Cloud className="w-6 h-6 text-sky-400" />;
  };

  // Find overall max/min across 7 days for range bar rendering
  const maxAllTemp = Math.max(...daily.map((d) => d.maxTempC));
  const minAllTemp = Math.min(...daily.map((d) => d.minTempC));
  const totalTempRange = Math.max(1, maxAllTemp - minAllTemp);

  return (
    <div
      id="five-day-dashboard-view"
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          <h3 className="font-semibold text-lg tracking-tight">5-Day & 7-Day Weather Dashboard</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Extended Tamil Nadu Outlook
        </span>
      </div>

      {/* Days List Grid */}
      <div className="space-y-3">
        {daily.map((day, idx) => {
          const isExpanded = expandedDayIdx === idx;

          // Compute horizontal bar range percentage
          const leftPercent = Math.round(((day.minTempC - minAllTemp) / totalTempRange) * 100);
          const barWidthPercent = Math.max(15, Math.round(((day.maxTempC - day.minTempC) / totalTempRange) * 100));

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-sky-300 dark:border-sky-800 shadow-xs bg-sky-50/40 dark:bg-slate-800/80'
                  : isDarkMode
                  ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
              }`}
            >
              {/* Clickable Header Row */}
              <div
                onClick={() => setExpandedDayIdx(isExpanded ? null : idx)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                {/* Day & Date */}
                <div className="flex items-center gap-3 min-w-[150px]">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{day.dayName}</span>
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-white font-bold">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {day.fullDateStr}
                    </span>
                  </div>
                </div>

                {/* Condition & Rain Chance */}
                <div className="flex items-center gap-4 min-w-[160px]">
                  <div>
                    <span className="text-xs font-semibold block">{day.condition}</span>
                    <div className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                      <CloudRain className="w-3 h-3" />
                      <span>{day.rainProbability}% ({day.totalPrecipitationMm}mm)</span>
                    </div>
                  </div>
                </div>

                {/* Temperature Range Bar */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-8 text-right">
                    {day.minTempC}°
                  </span>

                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold w-8">
                    {day.maxTempC}°
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="hidden sm:block text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expandable Detailed View */}
              {isExpanded && (
                <div className={`p-4 border-t space-y-3 ${
                  isDarkMode ? 'border-slate-700/60 bg-slate-900/60' : 'border-slate-200 bg-white/80'
                }`}>
                  {/* High Alert Banner if available */}
                  {day.alertWarning && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{day.alertWarning}: Precautionary monsoon travel advisories active.</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {day.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                        <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sunrise / Sunset</span>
                      </div>
                      <span className="font-bold">{day.sunriseTime} / {day.sunsetTime}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                        <Wind className="w-3.5 h-3.5 text-sky-500" />
                        <span>Max Wind Gusts</span>
                      </div>
                      <span className="font-bold">{day.maxWindSpeedKmh} km/h</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                        <Droplets className="w-3.5 h-3.5 text-sky-500" />
                        <span>Avg Humidity</span>
                      </div>
                      <span className="font-bold">{day.avgHumidity}%</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Peak UV Index</span>
                      </div>
                      <span className="font-bold">{day.uvIndexMax} / 12</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
