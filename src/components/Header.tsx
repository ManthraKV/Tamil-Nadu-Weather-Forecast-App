import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Moon, Sun, Bell, Compass, Check, ChevronDown, Globe, Loader2 } from 'lucide-react';
import { CityInfo, AppLanguage } from '../types';
import { TAMIL_NADU_CITIES, REGIONS } from '../data/cities';
import { TRANSLATIONS, REGION_TRANSLATIONS } from '../utils/translations';
import { searchOpenMeteoGeocoding } from '../services/weatherService';

interface HeaderProps {
  selectedCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAlerts: () => void;
  onOpenPushSettings: () => void;
  onOpenShareModal?: () => void;
  activeAlertsCount: number;
  lang: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  isDarkMode,
  onToggleDarkMode,
  onOpenAlerts,
  onOpenPushSettings,
  activeAlertsCount,
  lang,
  onSelectLanguage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');
  const [searchResults, setSearchResults] = useState<CityInfo[]>(TAMIL_NADU_CITIES);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = TRANSLATIONS[lang];

  // Fast local + Open-Meteo geocoding search handler
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(
        selectedRegionFilter === 'All'
          ? TAMIL_NADU_CITIES
          : TAMIL_NADU_CITIES.filter((c) => c.region === selectedRegionFilter)
      );
      setIsSearchingGeocode(false);
      return;
    }

    const trimmed = searchTerm.trim().toLowerCase();
    const localFiltered = TAMIL_NADU_CITIES.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(trimmed) ||
        city.tamilName.includes(trimmed) ||
        city.district.toLowerCase().includes(trimmed);

      const matchesRegion = selectedRegionFilter === 'All' || city.region === selectedRegionFilter;
      return matchesSearch && matchesRegion;
    });

    setSearchResults(localFiltered);

    // If search term length >= 3, trigger Open-Meteo geocoding for broader location coverage
    if (trimmed.length >= 3) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      setIsSearchingGeocode(true);

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const remoteResults = await searchOpenMeteoGeocoding(searchTerm);
          if (remoteResults.length > 0) {
            setSearchResults(remoteResults);
          }
        } catch (_err) {
          // fallback to local
        } finally {
          setIsSearchingGeocode(false);
        }
      }, 350);
    }
  }, [searchTerm, selectedRegionFilter]);

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
      isDarkMode ? 'bg-slate-900/60 border-slate-800/60 text-slate-100' : 'bg-white/70 border-amber-200/40 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Tamil Header */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-lg leading-tight tracking-tight">
                  {lang === 'ta' ? 'தமிழ்நாடு வானிலை' : 'Tamil Nadu Weather'}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                  {t.stateTag}
                </span>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Mobile Action Icons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 p-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold transition bg-slate-100 dark:bg-slate-800"
              >
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>{lang === 'ta' ? 'தமிழ்' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className={`absolute right-0 top-full mt-1.5 w-32 rounded-xl border shadow-xl z-50 p-1 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <button
                    onClick={() => {
                      onSelectLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      lang === 'en' ? 'bg-sky-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectLanguage('ta');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      lang === 'ta' ? 'bg-sky-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>தமிழ்</span>
                    {lang === 'ta' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t.toggleTheme}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t.weatherAlerts}
            >
              <Bell className="w-4 h-4 text-sky-500" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* City Selection & Open-Meteo Search Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="relative w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-sm font-medium transition shadow-xs ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-100'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="truncate">
                  {lang === 'ta' ? `${selectedCity.tamilName} (${selectedCity.name})` : selectedCity.name}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {lang === 'ta' ? `[${selectedCity.district}]` : `• ${selectedCity.district}`}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* City Dropdown Search Modal */}
            {isDropdownOpen && (
              <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border shadow-xl z-50 p-3 max-h-96 overflow-y-auto ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {/* Search Input */}
                <div className="relative mb-3">
                  {isSearchingGeocode ? (
                    <Loader2 className="w-4 h-4 absolute left-3 top-2.5 text-sky-500 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  )}
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Region Filter Tags */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 no-scrollbar">
                  <button
                    onClick={() => setSelectedRegionFilter('All')}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                      selectedRegionFilter === 'All'
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t.allTN}
                  </button>
                  {REGIONS.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegionFilter(reg)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                        selectedRegionFilter === reg
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {REGION_TRANSLATIONS[reg]?.[lang] || reg}
                    </button>
                  ))}
                </div>

                {/* Search Results List */}
                <div className="space-y-1">
                  {searchResults.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition ${
                        selectedCity.id === city.id
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {lang === 'ta' ? city.tamilName : city.name}
                        </span>
                        {lang === 'ta' ? (
                          <span className="text-slate-500 dark:text-slate-400 font-normal">
                            ({city.name})
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px]">
                            • {city.district}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {REGION_TRANSLATIONS[city.region]?.[lang] || city.region}
                        </span>
                        {selectedCity.id === city.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
                      </div>
                    </button>
                  ))}

                  {searchResults.length === 0 && !isSearchingGeocode && (
                    <p className="text-center py-4 text-xs text-slate-500">
                      {lang === 'ta'
                        ? `"${searchTerm}" பொருந்திய மாவட்டம் அல்லது நகரம் எதுவும் இல்லை`
                        : `No city matches "${searchTerm}"`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Top Right Language Dropdown */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition shadow-xs ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-750'
                  : 'bg-white border-slate-200 text-sky-600 hover:bg-slate-50'
              }`}
              title={t.language}
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{lang === 'ta' ? 'தமிழ்' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className={`absolute right-0 top-full mt-1.5 w-36 rounded-xl border shadow-xl z-50 p-1 ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <button
                  onClick={() => {
                    onSelectLanguage('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    lang === 'en'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span>English</span>
                    <span className="text-[10px] opacity-75 font-normal">English Mode</span>
                  </div>
                  {lang === 'en' && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    onSelectLanguage('ta');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition mt-0.5 ${
                    lang === 'ta'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span>தமிழ்</span>
                    <span className="text-[10px] opacity-75 font-normal">தமிழ் வடிவம்</span>
                  </div>
                  {lang === 'ta' && <Check className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-xl border transition shadow-xs ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={t.toggleTheme}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenAlerts}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-sm transition"
          >
            <Bell className="w-4 h-4" />
            <span>{t.weatherAlerts}</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-sky-600 text-[10px] font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPushSettings}
            className={`p-2.5 rounded-xl border transition shadow-xs ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={t.pushSettings}
          >
            <Bell className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
