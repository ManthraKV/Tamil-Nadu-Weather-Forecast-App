import React from 'react';
import { Compass, Sun, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CurrentWeather, AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import sunriseOceanImg from '../assets/images/ocean_sunrise_east_1786832138317.jpg';
import sunsetOceanImg from '../assets/images/ocean_sunset_west_1786832152424.jpg';

interface EastWestSunWidgetProps {
  weather: CurrentWeather;
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const EastWestSunWidget: React.FC<EastWestSunWidgetProps> = ({
  weather,
  isDarkMode,
  lang = 'en',
}) => {
  const t = TRANSLATIONS[lang];

  // Calculate approximate solar position percentage based on sunrise/sunset time
  const getSolarProgress = () => {
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Parse sunrise e.g. "06:05 AM"
      const [riseTime, risePeriod] = weather.sunrise.split(' ');
      let [riseH, riseM] = riseTime.split(':').map(Number);
      if (risePeriod === 'PM' && riseH < 12) riseH += 12;
      if (risePeriod === 'AM' && riseH === 12) riseH = 0;
      const riseMinutes = riseH * 60 + riseM;

      // Parse sunset e.g. "06:42 PM"
      const [setTime, setPeriod] = weather.sunset.split(' ');
      let [setH, setM] = setTime.split(':').map(Number);
      if (setPeriod === 'PM' && setH < 12) setH += 12;
      if (setPeriod === 'AM' && setH === 12) setH = 0;
      const setMinutes = setH * 60 + setM;

      if (currentMinutes < riseMinutes) return 0;
      if (currentMinutes > setMinutes) return 100;

      const progress = ((currentMinutes - riseMinutes) / (setMinutes - riseMinutes)) * 100;
      return Math.min(100, Math.max(0, Math.round(progress)));
    } catch (_e) {
      return 50;
    }
  };

  const solarProgress = getSolarProgress();

  return (
    <div
      id="east-west-sun-widget"
      className={`relative overflow-hidden rounded-3xl border transition-all p-3.5 sm:p-5 shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/65 border-slate-800/80 text-slate-100'
          : 'bg-white/75 border-slate-200/90 text-slate-800'
      }`}
    >
      {/* Background Ambient Sea Shimmer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-purple-500/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ocean-shimmer" />
      </div>

      {/* Main Grid: East Sunrise Ocean Window (Left), Solar Arc (Center), West Sunset Ocean Window (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* LEFT: EAST • OCEAN SUNRISE (4 cols) */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-2xl border border-amber-300/40 dark:border-amber-500/30 p-3.5 sm:p-4 shadow-sm group">
          {/* Dedicated Ocean Sunrise Viewport with cinematic video-like wave zoom */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={sunriseOceanImg}
              alt="Ocean Sea Sunrise East"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 ease-out animate-boomerang"
            />
            {/* Gradient Overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/60 to-slate-950/40 backdrop-blur-[1px]" />
            {/* Ocean Wave Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent animate-pulse" />
          </div>

          {/* Content Over Sunrise Image */}
          <div className="relative z-10 text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/30 border border-amber-300/60 text-amber-300 backdrop-blur-md shadow-sm">
                <ArrowUpRight className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  <span>{lang === 'ta' ? 'கிழக்கு' : 'EAST'}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                    {weather.sunrise}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 font-bold border border-amber-400/50 backdrop-blur-xs">
                    {t.sunrise}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: SOLAR TRAJECTORY ARC & DAYLIGHT TRACK (4 cols) */}
        <div className="lg:col-span-4 px-2 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-extrabold">
              <Compass className="w-3 h-3" /> {lang === 'ta' ? 'கிழக்கு' : 'East'}
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs">
              {t.solarPosition}: {solarProgress}%
            </span>
            <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1 font-extrabold">
              {lang === 'ta' ? 'மேற்கு' : 'West'} <Compass className="w-3 h-3" />
            </span>
          </div>

          {/* Arc Curve Visualization */}
          <div className="relative w-full h-12 flex items-end">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40">
              <path
                d="M 10,35 Q 100,-10 190,35"
                fill="none"
                stroke={isDarkMode ? '#334155' : '#cbd5e1'}
                strokeWidth="3"
                strokeDasharray="4 4"
              />
              <path
                d="M 10,35 Q 100,-10 190,35"
                fill="none"
                stroke="url(#solar-gradient)"
                strokeWidth="3.5"
                strokeDasharray="200"
                strokeDashoffset={200 - (solarProgress / 100) * 200}
              />
              <defs>
                <linearGradient id="solar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Sun Indicator Pin along trajectory */}
            <div
              className="absolute bottom-0 transition-all duration-700 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${Math.max(5, Math.min(95, solarProgress))}%`,
                bottom: `${Math.sin((solarProgress / 100) * Math.PI) * 30}px`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-500/60 flex items-center justify-center text-slate-900 animate-spin-slow">
                  <Sun className="w-3.5 h-3.5 fill-amber-300 text-amber-600" />
                </div>
                <div className="absolute -inset-1.5 rounded-full bg-amber-300 blur-xs -z-10 animate-ping opacity-60" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            {weather.isDay
              ? lang === 'ta'
                ? '☀️ பகல் நேரம் • தமிழக கடல் வானில் பயணிக்கும் கதிரவன்'
                : '☀️ Daylight Track • Sun traversing across coastal horizons'
              : lang === 'ta'
                ? '🌙 இரவு நேரம் • தமிழக விண்மீன் மற்றும் நிலவு வானம்'
                : '🌙 Night Horizon • Moonlit coastal ocean skies'}
          </p>
        </div>

        {/* RIGHT: WEST • OCEAN SUNSET (4 cols) */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-2xl border border-purple-300/40 dark:border-purple-500/30 p-3.5 sm:p-4 shadow-sm group">
          {/* Dedicated Ocean Sunset Viewport with cinematic video-like wave zoom */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={sunsetOceanImg}
              alt="Ocean Sea Sunset West"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 ease-out animate-boomerang"
            />
            {/* Gradient Overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/75 via-slate-900/60 to-slate-950/40 backdrop-blur-[1px]" />
            {/* Dusk Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent animate-pulse" />
          </div>

          {/* Content Over Sunset Image */}
          <div className="relative z-10 text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-300">
                  <span>{lang === 'ta' ? 'மேற்கு' : 'WEST'}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                    {weather.sunset}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold border border-purple-400/50 backdrop-blur-xs">
                    {t.sunset}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/30 border border-purple-300/60 text-purple-300 backdrop-blur-md shadow-sm ml-auto">
                <ArrowDownRight className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
