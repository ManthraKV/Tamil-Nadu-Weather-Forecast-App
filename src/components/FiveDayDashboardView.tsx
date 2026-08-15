import React, { useState } from 'react';
import { Calendar, CloudRain, Sun, Moon, Cloud, CloudLightning, ChevronDown, ChevronUp, Wind, Droplets, Sunrise, Sunset, AlertTriangle } from 'lucide-react';
import { DailyForecast, AppLanguage } from '../types';
import { TRANSLATIONS, CONDITION_TRANSLATIONS } from '../utils/translations';

interface FiveDayDashboardViewProps {
  daily: DailyForecast[];
  isDarkMode: boolean;
  lang?: AppLanguage;
}

const DAY_NAMES_TAMIL: Record<string, string> = {
  Today: 'இன்று',
  Tomorrow: 'நாளை',
  Mon: 'திங்கள்',
  Tue: 'செவ்வாய்',
  Wed: 'புதன்',
  Thu: 'வியாழன்',
  Fri: 'வெள்ளி',
  Sat: 'சனி',
  Sun: 'ஞாயிறு',
  Monday: 'திங்கள்',
  Tuesday: 'செவ்வாய்',
  Wednesday: 'புதன்',
  Thursday: 'வியாழன்',
  Friday: 'வெள்ளி',
  Saturday: 'சனி',
  Sunday: 'ஞாயிறு',
};

export const FiveDayDashboardView: React.FC<FiveDayDashboardViewProps> = ({
  daily,
  isDarkMode,
  lang = 'en',
}) => {
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(0);
  const t = TRANSLATIONS[lang];

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
      className={`rounded-3xl border p-4 sm:p-5 transition-all shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/50 border-slate-800/60 text-slate-100'
          : 'bg-white/55 border-amber-200/40 text-slate-800'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          <h3 className="font-bold text-base sm:text-lg tracking-tight">
            {t.dashboardTitle}
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          {t.dashboardSubtitle}
        </span>
      </div>

      {/* Days List Grid */}
      <div className="space-y-2.5">
        {daily.map((day, idx) => {
          const isExpanded = expandedDayIdx === idx;

          // Compute horizontal bar range percentage
          const leftPercent = Math.round(((day.minTempC - minAllTemp) / totalTempRange) * 100);
          const barWidthPercent = Math.max(15, Math.round(((day.maxTempC - day.minTempC) / totalTempRange) * 100));

          const dayDisplayName = lang === 'ta'
            ? DAY_NAMES_TAMIL[day.dayName] || day.dayName
            : day.dayName;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-sky-400/50 shadow-xs bg-sky-500/10 dark:bg-slate-800/60'
                  : isDarkMode
                  ? 'border-slate-800/60 bg-slate-800/30 hover:bg-slate-800/60'
                  : 'border-slate-200/50 bg-white/40 hover:bg-white/70'
              }`}
            >
              {/* Clickable Header Row */}
              <div
                onClick={() => setExpandedDayIdx(isExpanded ? null : idx)}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                {/* Day & Date */}
                <div className="flex items-center gap-3 min-w-[150px]">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{dayDisplayName}</span>
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-white font-bold">
                          {t.today}
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
                    <span className="text-xs font-semibold block">
                      {CONDITION_TRANSLATIONS[day.condition]?.[lang] || day.condition}
                    </span>
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

                {/* Expand indicator chevron */}
                <div className="flex items-center justify-end">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Detailed Breakdown when expanded */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-500" /> {t.humidity}
                    </span>
                    <p className="font-bold text-sm">{day.avgHumidity}% avg</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Wind className="w-3.5 h-3.5 text-sky-500" /> {t.windSpeed}
                    </span>
                    <p className="font-bold text-sm">{day.maxWindSpeedKmh} {lang === 'ta' ? 'கிமீ/ம' : 'km/h max'}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> {t.uvMax}
                    </span>
                    <p className="font-bold text-sm">Index {day.uvIndexMax}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-500" /> {t.sunrise} / {t.sunset}
                    </span>
                    <p className="font-bold text-xs">{day.sunriseTime} / {day.sunsetTime}</p>
                  </div>

                  {/* Summary & Alert warning if any */}
                  <div className="col-span-2 sm:col-span-4 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 flex items-start gap-2.5">
                    {day.alertWarning ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-800 dark:text-amber-300">
                            {lang === 'ta' ? 'வானிலை எச்சரிக்கை:' : 'Weather Advisory:'} {day.alertWarning}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300 mt-0.5">{day.summary}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        <span className="font-bold text-sky-600 dark:text-sky-400">{lang === 'ta' ? 'சுருக்கம்:' : 'Outlook:'}</span> {day.summary}
                      </p>
                    )}
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
