import React from 'react';
import { Compass, Sparkles, Sun, ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';
import { CurrentWeather, AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import kanyakumariSunriseImg from '../assets/images/kanyakumari_sunrise_1786826762929.jpg';
import kanyakumariSunsetImg from '../assets/images/kanyakumari_sunset_1786826778036.jpg';

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
      className={`relative overflow-hidden rounded-3xl border transition-all p-4 sm:p-5 shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800/60 text-slate-100'
          : 'bg-white/85 border-amber-100/80 text-slate-800'
      }`}
    >
      {/* Background Solar Arc Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-15">
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-400 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* TOP LEFT: EAST • KANYAKUMARI SEASIDE SUNRISE LIVE */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          {/* Live Boomerang / Seaside Sunrise Card */}
          <div className="relative group shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md shadow-amber-500/20 bg-slate-950">
            {/* Live Camera Feed Tag */}
            <div className="absolute top-1.5 left-1.5 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-amber-400/40 text-[9px] font-bold text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{lang === 'ta' ? 'நேரலை • கடற்கரை' : 'LIVE • Coast'}</span>
            </div>

            {/* Boomerang Video/Image with Shimmer */}
            <img
              src={kanyakumariSunriseImg}
              alt="Kanyakumari Seaside Sunrise"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-boomerang transform origin-center transition-transform duration-1000 scale-105 group-hover:scale-115"
            />

            {/* Ocean Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent pointer-events-none animate-ocean-shimmer" />
            
            {/* Bottom Label */}
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-1.5 py-1 text-center">
              <span className="text-[9px] sm:text-[10px] font-black text-amber-300 tracking-wider uppercase block truncate">
                {lang === 'ta' ? 'கன்னியாகுமரி சூரிய உதயம்' : 'Kanyakumari Sunrise'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'ta' ? 'கிழக்கு' : 'EAST'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold lowercase">
                {lang === 'ta' ? 'கடல்முனை' : 'Kanyakumari Coast'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {weather.sunrise}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                {t.sunrise}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">{t.dawnSubtitle}</span>
            </p>
          </div>
        </div>

        {/* CENTER: SOLAR TRAJECTORY ARC */}
        <div className="flex-1 w-full max-w-md px-2 flex flex-col items-center">
          <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Compass className="w-3 h-3" /> {lang === 'ta' ? 'கிழக்கு' : 'East'}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.solarPosition}: {solarProgress}%
            </span>
            <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
              {lang === 'ta' ? 'மேற்கு' : 'West'} <Compass className="w-3 h-3" />
            </span>
          </div>

          {/* Arc Curve Visualization */}
          <div className="relative w-full h-11 flex items-end">
            <svg className="w-full h-11 overflow-visible" viewBox="0 0 200 40">
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
                stroke="url(#sun-gradient)"
                strokeWidth="3"
                strokeDasharray="200"
                strokeDashoffset={200 - (solarProgress / 100) * 200}
              />
              <defs>
                <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                <div className="w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 flex items-center justify-center text-slate-900 animate-spin-slow">
                  <Sun className="w-3.5 h-3.5 fill-amber-300 text-amber-600" />
                </div>
                <div className="absolute -inset-1 rounded-full bg-amber-300 blur-xs -z-10 animate-ping" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {weather.isDay
              ? lang === 'ta'
                ? '☀️ பகல் நேரம் • தமிழக வானில் பயணிக்கும் கதிரவன்'
                : '☀️ Sun traversing across Tamil Nadu coastal skies'
              : lang === 'ta'
                ? '🌙 இரவு நேரம் • தமிழக விண்மீன் மற்றும் நிலவு வானம்'
                : '🌙 Night Horizon • Moonlit Coastline in Tamil Nadu'}
          </p>
        </div>

        {/* TOP RIGHT: WEST • KANYAKUMARI SEASIDE SUNSET LIVE */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-end">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-semibold lowercase">
                {lang === 'ta' ? 'முக்கடல் சங்கமம்' : 'Triveni Sangam'}
              </span>
              <span>{lang === 'ta' ? 'மேற்கு' : 'WEST'}</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="flex items-baseline justify-end gap-2 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
                {t.sunset}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {weather.sunset}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-end gap-1">
              <span className="truncate">{t.duskSubtitle}</span>
              <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
            </p>
          </div>

          {/* Live Boomerang / Seaside Sunset Card */}
          <div className="relative group shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-purple-500/80 shadow-md shadow-purple-500/20 bg-slate-950">
            {/* Live Camera Feed Tag */}
            <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-purple-400/40 text-[9px] font-bold text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              <span>{lang === 'ta' ? 'நேரலை • கடற்கரை' : 'LIVE • Coast'}</span>
            </div>

            {/* Boomerang Video/Image with Shimmer */}
            <img
              src={kanyakumariSunsetImg}
              alt="Kanyakumari Seaside Sunset"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-boomerang transform origin-center transition-transform duration-1000 scale-105 group-hover:scale-115"
            />

            {/* Ocean Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent pointer-events-none animate-ocean-shimmer" />

            {/* Bottom Label */}
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-1.5 py-1 text-center">
              <span className="text-[9px] sm:text-[10px] font-black text-rose-300 tracking-wider uppercase block truncate">
                {lang === 'ta' ? 'கன்னியாகுமரி சூரிய அஸ்தமனம்' : 'Kanyakumari Sunset'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
