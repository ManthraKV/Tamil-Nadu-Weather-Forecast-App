import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { EastWestSunWidget } from './components/EastWestSunWidget';
import { CulturalBackgroundLayer } from './components/CulturalBackgroundLayer';
import { HourlyForecastView } from './components/HourlyForecastView';
import { FiveDayDashboardView } from './components/FiveDayDashboardView';
import { PlanningRecommendationsCard } from './components/PlanningRecommendationsCard';
import { TamilNaduMap } from './components/TamilNaduMap';
import { AlertsModal } from './components/AlertsModal';
import { PushNotificationSettingsModal } from './components/PushNotificationSettingsModal';
import { DeployShareModal } from './components/DeployShareModal';

import { CityInfo, CurrentWeather, WeatherAlertRule, NotificationSettings, AppLanguage } from './types';
import { TAMIL_NADU_CITIES } from './data/cities';
import { fetchWeatherForCity } from './services/weatherService';
import { TRANSLATIONS } from './utils/translations';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tn_weather_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Language state (English / தமிழ்)
  const [language, setLanguage] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tn_weather_language') as AppLanguage | null;
      if (saved === 'en' || saved === 'ta') return saved;
    }
    return 'en';
  });

  // Selected City (Default Chennai)
  const [selectedCity, setSelectedCity] = useState<CityInfo>(TAMIL_NADU_CITIES[0]);

  // Weather data state
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Configured alerts
  const [alerts, setAlerts] = useState<WeatherAlertRule[]>([]);

  // Push notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    soundEnabled: true,
    cycloneAlerts: true,
    heavyRainAlerts: true,
    dailyBriefing: true,
    briefingTime: '07:00 AM',
  });

  // Modal Visibility
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isPushOpen, setIsPushOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const t = TRANSLATIONS[language];

  // Sync Dark Mode class on document
  useEffect(() => {
    localStorage.setItem('tn_weather_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync Language state to localStorage
  const handleSelectLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    localStorage.setItem('tn_weather_language', lang);
  };

  // Fetch Weather Data when city changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchWeatherForCity(selectedCity).then((data) => {
      if (isMounted) {
        setWeather(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Load configured alerts from Express Backend
  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
        }
      })
      .catch((err) => {
        console.warn('Backend alerts endpoint offline, using local memory:', err);
      });
  }, []);

  // Handle Add Alert
  const handleAddAlert = async (
    newAlert: Omit<WeatherAlertRule, 'id' | 'createdAt' | 'active'>
  ) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert),
      });
      const data = await res.json();
      if (data.success && data.alert) {
        setAlerts((prev) => [data.alert, ...prev]);
      }
    } catch (err) {
      console.warn('API add alert fallback:', err);
      const fallbackAlert: WeatherAlertRule = {
        ...newAlert,
        id: 'local-' + Date.now(),
        createdAt: new Date().toISOString(),
        active: true,
      };
      setAlerts((prev) => [fallbackAlert, ...prev]);
    }
  };

  // Handle Delete Alert
  const handleDeleteAlert = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete alert fallback:', err);
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      className={`relative min-h-screen transition-colors font-sans antialiased overflow-x-hidden ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-amber-50/50 text-slate-900'
      }`}
    >
      {/* Cultural Heritage Parallax Background Layer */}
      <CulturalBackgroundLayer isDarkMode={isDarkMode} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Top Right Language Toggle & No GPS */}
        <Header
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onOpenPushSettings={() => setIsPushOpen(true)}
          activeAlertsCount={alerts.length}
          lang={language}
          onSelectLanguage={handleSelectLanguage}
        />

        {/* Main Content Dashboard */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {isLoading || !weather ? (
            /* Loading Skeleton */
            <div className="space-y-6 animate-pulse">
              <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          ) : (
            <>
              {/* TOP SUN WIDGET: Lighter Background, Sunrise (East) Left & Sunset (West) Right */}
              <EastWestSunWidget weather={weather} isDarkMode={isDarkMode} lang={language} />

              {/* Top Row: Current Weather Hero Card */}
              <CurrentWeatherCard weather={weather} isDarkMode={isDarkMode} lang={language} />

              {/* Middle Row: Hourly Forecast Timeline */}
              <HourlyForecastView hourly={weather.hourly} isDarkMode={isDarkMode} lang={language} />

              {/* Grid Row: 7-Day Dashboard & Non-interactive Tamil Nadu Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: 7-Day Forecast View */}
                <div className="lg:col-span-7">
                  <FiveDayDashboardView daily={weather.daily} isDarkMode={isDarkMode} lang={language} />
                </div>

                {/* Right Column: Regional Tamil Nadu Map */}
                <div className="lg:col-span-5">
                  <TamilNaduMap
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCity}
                    isDarkMode={isDarkMode}
                    lang={language}
                  />
                </div>
              </div>

              {/* Smart Day & Travel Planning Recommendations */}
              <PlanningRecommendationsCard
                weather={weather}
                isDarkMode={isDarkMode}
                lang={language}
              />
            </>
          )}
        </main>

        {/* Modals */}
        <AlertsModal
          isOpen={isAlertsOpen}
          onClose={() => setIsAlertsOpen(false)}
          alerts={alerts}
          onAddAlert={handleAddAlert}
          onDeleteAlert={handleDeleteAlert}
          isDarkMode={isDarkMode}
          lang={language}
        />

        <PushNotificationSettingsModal
          isOpen={isPushOpen}
          onClose={() => setIsPushOpen(false)}
          settings={notificationSettings}
          onUpdateSettings={setNotificationSettings}
          isDarkMode={isDarkMode}
        />

        <DeployShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          isDarkMode={isDarkMode}
        />

        {/* Footer */}
        <footer className={`border-t py-8 mt-12 transition-colors ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-white/80 border-slate-200 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {t.footerTitle}
              </p>
              <p className="mt-0.5">
                {t.footerSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 font-medium">
              <button
                onClick={() => setIsShareOpen(true)}
                className="hover:text-sky-500 transition underline"
              >
                {t.footerShare}
              </button>
              <span>•</span>
              <button
                onClick={() => setIsAlertsOpen(true)}
                className="hover:text-sky-500 transition underline"
              >
                {t.footerAlerts}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
