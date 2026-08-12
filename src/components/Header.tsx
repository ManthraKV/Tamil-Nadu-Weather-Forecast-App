import React, { useState } from 'react';
import { Search, MapPin, Moon, Sun, Bell, Share2, Compass, Check, ChevronDown } from 'lucide-react';
import { CityInfo } from '../types';
import { TAMIL_NADU_CITIES, REGIONS } from '../data/cities';

interface HeaderProps {
  selectedCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAlerts: () => void;
  onOpenPushSettings: () => void;
  onOpenShareModal: () => void;
  activeAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  isDarkMode,
  onToggleDarkMode,
  onOpenAlerts,
  onOpenPushSettings,
  onOpenShareModal,
  activeAlertsCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');

  const filteredCities = TAMIL_NADU_CITIES.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.tamilName.includes(searchTerm) ||
      city.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegionFilter === 'All' || city.region === selectedRegionFilter;
    return matchesSearch && matchesRegion;
  });

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Find closest Tamil Nadu city in list
          let closest = TAMIL_NADU_CITIES[0];
          let minDistance = Number.MAX_VALUE;

          TAMIL_NADU_CITIES.forEach((c) => {
            const dist = Math.hypot(c.lat - latitude, c.lng - longitude);
            if (dist < minDistance) {
              minDistance = dist;
              closest = c;
            }
          });

          onSelectCity(closest);
        },
        (_err) => {
          alert('Could not access current location. Selecting default capital Chennai.');
          onSelectCity(TAMIL_NADU_CITIES[0]);
        }
      );
    }
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
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
                <h1 className="font-bold text-lg leading-tight tracking-tight">Tamil Nadu Weather</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                  TN State
                </span>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                தமிழ்நாடு வானிலை முன்னறிவிப்பு
              </p>
            </div>
          </div>

          {/* Quick Mobile Action Icons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Weather Alert Settings"
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

        {/* City Selection & Search Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
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
                  <span className="truncate">{selectedCity.name} ({selectedCity.tamilName})</span>
                  <span className="text-xs text-slate-500 truncate">[{selectedCity.district}]</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              </button>

              {/* City Dropdown Modal */}
              {isDropdownOpen && (
                <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border shadow-xl z-50 p-3 max-h-96 overflow-y-auto ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {/* Search Input */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search TN City, Tamil name, or District..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
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
                      All TN
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
                        {reg}
                      </button>
                    ))}
                  </div>

                  {/* Filtered Cities List */}
                  <div className="space-y-1">
                    {filteredCities.map((city) => (
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
                          <span className="font-semibold">{city.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">
                            ({city.tamilName})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {city.region}
                          </span>
                          {selectedCity.id === city.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
                        </div>
                      </button>
                    ))}

                    {filteredCities.length === 0 && (
                      <p className="text-center py-4 text-xs text-slate-500">
                        No Tamil Nadu city matches "{searchTerm}"
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* GPS Location Detect Button */}
            <button
              onClick={handleDetectLocation}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition shadow-xs ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title="Detect my current location"
            >
              <Compass className="w-4 h-4 text-sky-500" />
              <span className="hidden sm:inline">GPS</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-xl border transition shadow-xs ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenAlerts}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-sm transition"
          >
            <Bell className="w-4 h-4" />
            <span>Weather Alerts</span>
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
            title="Push Notification Settings"
          >
            <Bell className="w-4 h-4 text-indigo-500" />
          </button>

          <button
            onClick={onOpenShareModal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition shadow-xs ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-sky-500" />
            <span>Share & Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
