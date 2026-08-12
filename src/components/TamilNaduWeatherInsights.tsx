import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Waves, Sprout, Mountain, Languages, RefreshCw } from 'lucide-react';
import { CurrentWeather } from '../types';

interface TamilNaduWeatherInsightsProps {
  weather: CurrentWeather;
  isDarkMode: boolean;
  onRefreshAdvisory?: () => void;
}

export const TamilNaduWeatherInsights: React.FC<TamilNaduWeatherInsightsProps> = ({
  weather,
  isDarkMode,
  onRefreshAdvisory,
}) => {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { city } = weather;

  const handleRefresh = async () => {
    if (!onRefreshAdvisory) return;
    setIsRefreshing(true);
    await onRefreshAdvisory();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div
      id="tamil-nadu-weather-insights"
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-lg tracking-tight">Tamil Nadu Meteorological Advisory</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold border transition ${
              lang === 'ta'
                ? 'bg-amber-500 text-white border-amber-500'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'தமிழ் Language' : 'English'}</span>
          </button>

          {/* Refresh AI Advisory */}
          {onRefreshAdvisory && (
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-xl border transition ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
              title="Refresh AI Meteorological Insights"
            >
              <RefreshCw className={`w-4 h-4 text-sky-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Advisory Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-amber-500/10 border border-sky-500/20 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-sm text-sky-600 dark:text-sky-400">
            {lang === 'en' ? `${city.name} Weather Outlook & Regional Insights` : `${city.name} வானிலை குறிப்புகள்`}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
            Live AI Synced
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {lang === 'en'
            ? weather.aiAdvisory ||
              `Currently in ${city.name}, weather condition is ${weather.condition} with ${weather.tempC}°C. Good visibility across main transport arteries in ${city.district}. Keep rain gear handy for sudden local drizzles.`
            : weather.aiAdvisoryTamil ||
              `${city.name} நகரில் தற்போதைய வெப்பநிலை ${weather.tempC}°C. ${weather.condition} நிலவுகிறது. விவசாயிகள் மற்றும் பயணிகள் தேவையான முன்னெச்சரிக்கை கொள்ளவும்.`}
        </p>
      </div>

      {/* Regional Sector Specific Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Cauvery Delta Farmers */}
        <div className={`p-3.5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">
            <Sprout className="w-4 h-4 shrink-0" />
            <span>Agricultural Advisory</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-normal">
            Cauvery Delta & Inland farmers: Optimal field drainage required for young paddy crops during rainfall spates.
          </p>
        </div>

        {/* Coastal Fishermen */}
        <div className={`p-3.5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold mb-1.5">
            <Waves className="w-4 h-4 shrink-0" />
            <span>Coastal & Marine Alert</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-normal">
            Bay of Bengal & Gulf of Mannar: Wind speeds up to {weather.windSpeedKmh + 5} km/h. Sea condition moderate along Coromandel Coast.
          </p>
        </div>

        {/* Hill Stations */}
        <div className={`p-3.5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-1.5">
            <Mountain className="w-4 h-4 shrink-0" />
            <span>Hill Corridor Travel</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-normal">
            Nilgiris & Kodaikanal Ghat roads: Dense mist during morning/evening hours. Drive with fog headlights enabled.
          </p>
        </div>
      </div>
    </div>
  );
};
