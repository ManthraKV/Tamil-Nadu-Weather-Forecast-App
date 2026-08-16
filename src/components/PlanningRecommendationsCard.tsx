import React from 'react';
import {
  Compass,
  Footprints,
  Car,
  Shirt,
  Sprout,
  Sun,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CurrentWeather, AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface PlanningRecommendationsCardProps {
  weather: CurrentWeather;
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const PlanningRecommendationsCard: React.FC<PlanningRecommendationsCardProps> = ({
  weather,
  isDarkMode,
  lang = 'en',
}) => {
  const t = TRANSLATIONS[lang];
  const { tempC, humidity, windSpeedKmh, uvIndex, rainfall24hMm, condition, daily } = weather;

  // Compute recommendation insights based on live parameters
  const isHighHeat = tempC >= 34;
  const isRainLikely = rainfall24hMm > 1 || condition.includes('Rain') || condition.includes('Thunderstorm');
  const isBreezy = windSpeedKmh > 20;

  // Best outdoor fitness window
  const bestOutdoorWindow = isHighHeat
    ? lang === 'ta'
      ? 'காலை 05:45 - 07:30 அல்லது மாலை 05:30 - 07:00'
      : '05:45 AM - 07:30 AM or 05:30 PM - 07:00 PM'
    : isRainLikely
    ? lang === 'ta'
      ? 'மழை இடைவேளைகளில் (முற்பகல் 09:00 - 11:30)'
      : 'During rain breaks (09:00 AM - 11:30 AM)'
    : lang === 'ta'
    ? 'காலை 06:00 - 09:00 & மாலை 05:00 - 07:00'
    : '06:00 AM - 09:00 AM & 05:00 PM - 07:00 PM';

  // Find the clearest days in the 7-day forecast for weekend/weekly planning
  const clearDays = daily
    .filter((d, i) => i > 0 && d.rainProbability < 35)
    .map((d) => d.dayName);

  const bestDayForTravel = clearDays.length > 0
    ? clearDays.slice(0, 2).join(' & ')
    : daily[1]?.dayName || (lang === 'ta' ? 'நாளை' : 'Tomorrow');

  return (
    <div
      id="planning-recommendations-card"
      className={`rounded-3xl border p-4 sm:p-5 transition-all shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800/70 text-slate-100'
          : 'bg-white/80 border-slate-200/90 text-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 border border-sky-400/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
              {t.planningTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {t.planningSubtitle}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'நேரலை வழிகாட்டல்' : 'Live Insights'}</span>
        </span>
      </div>

      {/* 4 Core Planning Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Outdoor & Fitness */}
        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50/90 border-slate-200/80'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1.5">
              <Footprints className="w-4 h-4" />
              <span>{t.outdoorFitness}</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              {isRainLikely
                ? lang === 'ta'
                  ? 'மழை எச்சரிக்கை: உள்ளரங்கு உடற்பயிற்சி சிறந்தது'
                  : 'Rain Likely: Indoor workout recommended'
                : isHighHeat
                ? lang === 'ta'
                  ? 'வெயில் அதிகம்: நண்பகல் வெயிலை தவிர்க்கவும்'
                  : 'High Heat: Avoid peak midday sun'
                : lang === 'ta'
                ? 'சிறந்த வெளிப்புற நடைபயிற்சி வானிலை'
                : 'Ideal conditions for walking & sports'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                {t.bestTimeOut}:
              </span>
              <span className="text-xs font-black text-sky-700 dark:text-sky-300 mt-0.5 block">
                {bestOutdoorWindow}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Travel & Commute */}
        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50/90 border-slate-200/80'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1.5">
              <Car className="w-4 h-4" />
              <span>{t.travelCommute}</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              {isRainLikely
                ? lang === 'ta'
                  ? 'ஈரமான சாலைகள் • குடை மற்றும் மழைக்கோட் தேவை'
                  : 'Wet Roads: Keep umbrella & rain gear handy'
                : isBreezy
                ? lang === 'ta'
                  ? 'தென்றல் காற்று • இருசக்கர வாகனத்தில் எச்சரிக்கை'
                  : 'Breezy: Safe two-wheeler riding with caution'
                : lang === 'ta'
                ? 'தெளிவான சாலைகள் & சீரான போக்குவரத்து'
                : 'Clear roads & smooth traffic conditions'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                {lang === 'ta' ? '7 நாள் சிறந்த பயண நாள்:' : 'Best 7-Day Travel Window:'}
              </span>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 mt-0.5 block">
                {bestDayForTravel} ({lang === 'ta' ? 'குறைந்த மழை' : 'Lowest Rain Risk'})
              </span>
            </div>
          </div>
        </div>

        {/* 3. Clothing & UV Care */}
        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50/90 border-slate-200/80'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5">
              <Shirt className="w-4 h-4" />
              <span>{t.clothingCare}</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              {uvIndex >= 7
                ? lang === 'ta'
                  ? 'அதிக UV: மெல்லிய பருத்தி ஆடைகள் & சன்ஸ்கிரீன்'
                  : 'High UV: Light breathable cottons & sunglasses'
                : tempC < 24
                ? lang === 'ta'
                  ? 'இதமான குளிர்: லேசான மேலாடை போதுமானது'
                  : 'Mild Cool: Light windcheater or jacket'
                : lang === 'ta'
                ? 'சாதாரண பருத்தி ஆடைகள் & போதுமான குடிநீர்'
                : 'Comfortable everyday cotton wear'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                {lang === 'ta' ? 'நீரேற்ற ஆலோசனை:' : 'Hydration Advisory:'}
              </span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-300 mt-0.5 block">
                {tempC > 32
                  ? lang === 'ta'
                    ? '3 - 3.5 லிட்டர் குடிநீர் மற்றும் இளநீர்'
                    : 'Drink 3 - 3.5L water & stay hydrated'
                  : lang === 'ta'
                  ? '2 - 2.5 லிட்டர் குடிநீர்'
                  : 'Drink 2 - 2.5L water regularly'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Coastal & Farming */}
        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50/90 border-slate-200/80'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
              <Sprout className="w-4 h-4" />
              <span>{t.coastalFarming}</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              {isRainLikely
                ? lang === 'ta'
                  ? 'மழை வாய்ப்பு • பயிர்ப் பாதுகாப்பு & வடிகால் சரிபார்த்தல்'
                  : 'Rainfall: Check field drainage & harvest cover'
                : humidity > 75
                ? lang === 'ta'
                  ? 'அதிக ஈரப்பதம் • பூச்சித் தாக்குதல் கண்காணிப்பு'
                  : 'High Humidity: Monitor crops for moisture pests'
                : lang === 'ta'
                ? 'தானியங்கள் உலர்த்துவதற்கும் பாசனத்திற்கும் ஏற்ற வானிலை'
                : 'Favorable for crop drying & field irrigation'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                {lang === 'ta' ? 'கடலோர நிலை:' : 'Coastal Wind Status:'}
              </span>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                {windSpeedKmh < 25
                  ? lang === 'ta'
                    ? 'சாதாரண காற்று (மீனவர்கள் கடலுக்குச் செல்லலாம்)'
                    : 'Normal Winds (Safe for coastal activities)'
                  : lang === 'ta'
                  ? 'வேகமான காற்று (எச்சரிக்கையுடன் செல்லவும்)'
                  : 'Gusty Winds (Exercise marine caution)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
