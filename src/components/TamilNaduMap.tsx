import React, { useState } from 'react';
import { MapPin, Layers, Thermometer, CloudRain, ShieldAlert, Sparkles } from 'lucide-react';
import { CityInfo } from '../types';
import { TAMIL_NADU_CITIES } from '../data/cities';

interface TamilNaduMapProps {
  selectedCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  isDarkMode: boolean;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  selectedCity,
  onSelectCity,
  isDarkMode,
}) => {
  const [mapMode, setMapMode] = useState<'svg' | 'overlay'>('svg');
  const [activeOverlay, setActiveOverlay] = useState<'temp' | 'rain' | 'aqi'>('temp');

  // Relative SVG mapping coordinates for Tamil Nadu major hubs
  const mapWidth = 600;
  const mapHeight = 550;

  // Lat/Lng conversion helper to SVG canvas
  // TN Lat range: ~8.0 (Kanyakumari) to 13.5 (Chennai/Vellore)
  // TN Lng range: ~76.2 (Nilgiris) to 80.3 (Chennai)
  const getSvgCoords = (lat: number, lng: number) => {
    const minLat = 8.0;
    const maxLat = 13.6;
    const minLng = 76.2;
    const maxLng = 80.4;

    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 80) + 40;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * (mapHeight - 80) + 40;
    return { x, y };
  };

  // Mock overlay temperature generator for cities
  const getCityOverlayData = (city: CityInfo) => {
    const isHill = city.elevationMeters > 1000;
    if (activeOverlay === 'temp') {
      return isHill ? '16°C' : city.region === 'Coastal TN' ? '32°C' : '34°C';
    } else if (activeOverlay === 'rain') {
      return isHill ? '70%' : city.region === 'Coastal TN' ? '45%' : '20%';
    } else {
      return isHill ? 'AQI 22' : city.id === 'chennai' ? 'AQI 88' : 'AQI 54';
    }
  };

  const getOverlayBg = (city: CityInfo) => {
    const isHill = city.elevationMeters > 1000;
    if (activeOverlay === 'temp') {
      return isHill ? 'bg-emerald-500 text-white' : city.region === 'Coastal TN' ? 'bg-sky-500 text-white' : 'bg-amber-500 text-white';
    } else if (activeOverlay === 'rain') {
      return isHill ? 'bg-indigo-600 text-white' : 'bg-sky-600 text-white';
    } else {
      return isHill ? 'bg-emerald-600 text-white' : city.id === 'chennai' ? 'bg-amber-600 text-white' : 'bg-sky-600 text-white';
    }
  };

  return (
    <div
      id="tamil-nadu-map-container"
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500" />
            <h3 className="font-semibold text-lg tracking-tight">Tamil Nadu Regional Map</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium">
              Interactive State View
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select any district or city pin to inspect real-time micro-climate forecasts.
          </p>
        </div>

        {/* Overlay Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveOverlay('temp')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
              activeOverlay === 'temp'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temp
          </button>

          <button
            onClick={() => setActiveOverlay('rain')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
              activeOverlay === 'rain'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rain Radar
          </button>

          <button
            onClick={() => setActiveOverlay('aqi')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
              activeOverlay === 'aqi'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Air Quality
          </button>
        </div>
      </div>

      {/* SVG Interactive State Map Canvas */}
      <div className={`relative w-full rounded-xl overflow-hidden border p-2 flex justify-center items-center ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-auto max-h-[460px] select-none"
        >
          <defs>
            {/* Subtle Gradient for Tamil Nadu Geography Outline */}
            <linearGradient id="tnGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
            <linearGradient id="tnGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          {/* Tamil Nadu State Stylized Boundary Shape */}
          <path
            d="M 520 70 
               Q 480 90, 420 80 
               Q 350 70, 280 110 
               Q 200 120, 110 130 
               Q 80 200, 100 270 
               Q 120 340, 160 410 
               Q 200 480, 240 520 
               Q 270 500, 310 470 
               Q 380 430, 440 370 
               Q 500 300, 520 220 
               Q 540 140, 520 70 Z"
            fill={isDarkMode ? 'url(#tnGradDark)' : 'url(#tnGradLight)'}
            stroke={isDarkMode ? '#334155' : '#cbd5e1'}
            strokeWidth="2.5"
            strokeDasharray="none"
          />

          {/* Bay of Bengal & Arabian Sea decorative water labels */}
          <text x="440" y="240" fontSize="11" fill={isDarkMode ? '#475569' : '#94a3b8'} fontStyle="italic" fontWeight="500">
            Bay of Bengal
          </text>
          <text x="60" y="480" fontSize="11" fill={isDarkMode ? '#475569' : '#94a3b8'} fontStyle="italic" fontWeight="500">
            Indian Ocean / Gulf of Mannar
          </text>

          {/* Western Ghats Mountain Ridge representation */}
          <path
            d="M 100 140 Q 110 240, 130 330 Q 180 440, 230 500"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text x="80" y="260" fontSize="10" fill="#10b981" fontWeight="600" transform="rotate(-75 80 260)">
            Western Ghats Ridge
          </text>

          {/* Cauvery River line */}
          <path
            d="M 280 180 Q 380 210, 480 250"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Interactive City Nodes */}
          {TAMIL_NADU_CITIES.map((city) => {
            const { x, y } = getSvgCoords(city.lat, city.lng);
            const isSelected = selectedCity.id === city.id;
            const overlayVal = getCityOverlayData(city);

            return (
              <g
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="cursor-pointer group"
              >
                {/* Selection Ripple Ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    className="animate-ping fill-sky-400 opacity-25"
                  />
                )}

                {/* City Base Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 5}
                  className={`transition-all duration-200 ${
                    isSelected
                      ? 'fill-sky-500 stroke-white stroke-2'
                      : isDarkMode
                      ? 'fill-slate-300 group-hover:fill-sky-400'
                      : 'fill-slate-700 group-hover:fill-sky-600'
                  }`}
                />

                {/* City Overlay Value Tag */}
                <rect
                  x={x - 22}
                  y={y - 24}
                  width="44"
                  height="16"
                  rx="4"
                  className={`transition ${
                    isSelected ? 'fill-sky-600 text-white' : isDarkMode ? 'fill-slate-800' : 'fill-white'
                  }`}
                  stroke={isSelected ? '#0284c7' : isDarkMode ? '#475569' : '#cbd5e1'}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y - 13}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={isSelected ? '#ffffff' : isDarkMode ? '#cbd5e1' : '#334155'}
                >
                  {overlayVal}
                </text>

                {/* City English & Tamil Label */}
                <text
                  x={x}
                  y={y + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : '500'}
                  fill={isSelected ? '#0284c7' : isDarkMode ? '#f1f5f9' : '#1e293b'}
                  className="transition"
                >
                  {city.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Stats Card for Selected City */}
        <div className={`absolute bottom-3 left-3 right-3 sm:right-auto max-w-sm rounded-xl p-3 border shadow-md backdrop-blur-md transition-all ${
          isDarkMode ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">{selectedCity.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-sm bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                  {selectedCity.tamilName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCity.district} District • {selectedCity.region}
              </p>
            </div>
            <button
              onClick={() => onSelectCity(selectedCity)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-xs transition"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
