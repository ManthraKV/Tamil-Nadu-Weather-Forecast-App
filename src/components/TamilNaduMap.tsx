import React, { useState } from 'react';
import { MapPin, Thermometer, CloudRain, ShieldAlert } from 'lucide-react';
import { CityInfo, AppLanguage } from '../types';
import { TAMIL_NADU_CITIES } from '../data/cities';
import { TRANSLATIONS } from '../utils/translations';

interface TamilNaduMapProps {
  selectedCity: CityInfo;
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  selectedCity,
  isDarkMode,
  lang = 'en',
}) => {
  const [activeOverlay, setActiveOverlay] = useState<'temp' | 'rain' | 'aqi'>('temp');
  const t = TRANSLATIONS[lang];

  // Canvas dimensions
  const mapWidth = 620;
  const mapHeight = 580;

  // Accurate Mercator projection matching Tamil Nadu lat/long bounds
  // Lat: 7.9°N (south of Kanyakumari) to 13.65°N (north of Thiruvallur/Pulicat)
  // Lng: 76.0°E (west of Nilgiris/Anaimalai) to 80.5°E (east of Chennai/Point Calimere)
  const getSvgCoords = (lat: number, lng: number) => {
    const minLat = 7.9;
    const maxLat = 13.65;
    const minLng = 76.0;
    const maxLng = 80.5;

    const marginX = 40;
    const marginY = 32;
    const drawWidth = 520;
    const drawHeight = 510;

    const x = marginX + ((lng - minLng) / (maxLng - minLng)) * drawWidth;
    const y = marginY + ((maxLat - lat) / (maxLat - minLat)) * drawHeight;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  // Convert key boundary control points to SVG path commands
  // Accurate geographic perimeter of Tamil Nadu (Clockwise from Pulicat Lake tip down to Kanyakumari and up the Western Ghats)
  const boundaryGeoPoints: [number, number][] = [
    [13.55, 80.20], // Pulicat / Gummidipoondi
    [13.20, 80.32], // Ennore / North Chennai
    [13.08, 80.28], // Chennai Marina
    [12.75, 80.24], // Kovalam / Chengalpattu coast
    [12.50, 80.16], // Mahabalipuram
    [12.15, 79.98], // Marakkanam
    [11.93, 79.83], // Puducherry / Cuddalore border
    [11.60, 79.77], // Cuddalore / Parangipettai
    [11.20, 79.84], // Poompuhar / Sirkazhi
    [10.90, 79.84], // Karaikal / Nagore
    [10.75, 79.85], // Nagapattinam / Velankanni
    [10.30, 79.86], // Point Calimere (Kodiakkarai)
    [10.28, 79.48], // Muthupet lagoon / Adirampattinam
    [9.90, 79.15],  // Manamelkudi / Palk Bay coast
    [9.50, 78.90],  // Thondi / Devipattinam
    [9.28, 79.32],  // Mandapam / Pamban
    [9.18, 79.42],  // Rameswaram Dhanushkodi horn
    [9.20, 79.15],  // Pamban South coast
    [9.12, 78.60],  // Kilakarai / Sayalgudi
    [8.76, 78.16],  // Thoothukudi VOC Port
    [8.48, 78.05],  // Tiruchendur
    [8.18, 77.72],  // Koodankulam / Uvari
    [8.08, 77.55],  // Cape Comorin (Kanyakumari Tip)
    [8.18, 77.25],  // Colachel / Nagercoil West
    [8.55, 77.20],  // Shenkottai / Pechiparai border
    [8.95, 77.10],  // Tenkasi / Courtallam Ghats
    [9.60, 77.30],  // Srivilliputhur / Megamalai
    [10.05, 77.25], // Theni / Bodinayakkanur
    [10.35, 76.95], // Anaimalai / Valparai
    [10.85, 76.85], // Palghat gap (Coimbatore west)
    [11.05, 76.70], // Siruvani hills
    [11.45, 76.45], // Nilgiris Gudalur / Devala
    [11.62, 76.70], // Mudumalai / Moyar
    [11.85, 77.10], // Sathyamangalam / Hasanur
    [11.98, 77.45], // Bargur hills
    [12.15, 77.75], // Hogenakkal / Dharmapuri border
    [12.75, 77.60], // Denkanikottai / Hosur bulge
    [12.85, 77.95], // Krishnagiri North
    [12.80, 78.60], // Vaniyambadi / Ambur border
    [13.00, 79.10], // Vellore / Katpadi North
    [13.25, 79.60], // Arakkonam / Tiruttani
    [13.50, 80.05], // Thiruvallur North
  ];

  // Convert array of geo-points to SVG polygon path with smooth curves
  const generateBoundaryPath = () => {
    return boundaryGeoPoints.map((pt, i) => {
      const { x, y } = getSvgCoords(pt[0], pt[1]);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  // Metric calculation helpers per city
  const getCityTemp = (city: CityInfo): number => {
    if (city.elevationMeters > 1500) return 16; // Ooty, Kodaikanal
    if (city.elevationMeters > 1000) return 20; // Yercaud, Valparai
    if (city.region === 'Coastal TN') return 31; // Chennai, Nagapattinam, Rameswaram
    if (city.id === 'madurai' || city.id === 'trichy' || city.id === 'vellore') return 36; // Hot inland
    return 33;
  };

  const getCityRainProb = (city: CityInfo): number => {
    if (city.elevationMeters > 1000) return 75;
    if (city.region === 'Coastal TN') return 45;
    if (city.id === 'madurai' || city.id === 'thoothukudi') return 10;
    return 25;
  };

  const getCityAqi = (city: CityInfo): number => {
    if (city.elevationMeters > 1000) return 18;
    if (city.id === 'chennai') return 82;
    if (city.id === 'coimbatore' || city.id === 'madurai') return 56;
    return 38;
  };

  // User-specified Dynamic Color Rules:
  // - Temp: in shades of yellow to red based on temperature value (Yellow <=20, Amber 21-30, Orange 31-33, Red >33)
  // - Rain radar: red for very high rain (>55%), yellow for no rain (<=15%), blue for mild rain (16-55%)
  // - Air quality: in shades of AQI value (Good <=50 Green, Moderate 51-100 Amber, Poor >100 Red)
  const getMetricStyleAndIcon = (city: CityInfo) => {
    if (activeOverlay === 'temp') {
      const temp = getCityTemp(city);
      const icon = '🌡️';
      const label = `${temp}°C`;
      if (temp <= 20) {
        return { color: '#eab308', stroke: '#ca8a04', icon, label, bgClass: 'bg-yellow-500' };
      }
      if (temp <= 30) {
        return { color: '#f59e0b', stroke: '#d97706', icon, label, bgClass: 'bg-amber-500' };
      }
      if (temp <= 33) {
        return { color: '#f97316', stroke: '#ea580c', icon, label, bgClass: 'bg-orange-500' };
      }
      return { color: '#ef4444', stroke: '#dc2626', icon, label, bgClass: 'bg-rose-500' };
    }

    if (activeOverlay === 'rain') {
      const rain = getCityRainProb(city);
      const icon = '🌧️';
      const label = `${rain}%`;
      if (rain <= 15) {
        return { color: '#eab308', stroke: '#ca8a04', icon, label, bgClass: 'bg-yellow-500' };
      }
      if (rain <= 55) {
        return { color: '#0284c7', stroke: '#0369a1', icon, label, bgClass: 'bg-sky-500' };
      }
      return { color: '#ef4444', stroke: '#dc2626', icon, label, bgClass: 'bg-rose-600' };
    }

    // AQI Mode
    const aqi = getCityAqi(city);
    const icon = '🍃';
    const label = `AQI ${aqi}`;
    if (aqi <= 50) {
      return { color: '#10b981', stroke: '#059669', icon, label, bgClass: 'bg-emerald-500' };
    }
    if (aqi <= 100) {
      return { color: '#f59e0b', stroke: '#d97706', icon, label, bgClass: 'bg-amber-500' };
    }
    return { color: '#ef4444', stroke: '#dc2626', icon, label, bgClass: 'bg-rose-600' };
  };

  // Curated list of distinct primary district hubs spread across all geographic zones
  // to maintain high clarity without overcrowded pins
  const DISPLAY_CITY_IDS = [
    'chennai',
    'hosur',
    'vellore',
    'salem',
    'ooty',
    'coimbatore',
    'tiruchirappalli',
    'thanjavur',
    'cuddalore',
    'dindigul',
    'madurai',
    'ramanathapuram',
    'thoothukudi',
    'tirunelveli',
    'nagercoil',
  ];

  const mapCities = TAMIL_NADU_CITIES.filter((c) => DISPLAY_CITY_IDS.includes(c.id));

  return (
    <div
      id="tamil-nadu-map-container"
      className={`rounded-3xl border p-4 sm:p-5 transition-all shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/50 border-slate-800/60 text-slate-100'
          : 'bg-white/55 border-amber-200/40 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500" />
            <h3 className="font-bold text-base sm:text-lg tracking-tight">
              {t.mapTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Overlay Toggles */}
        <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-0.5 rounded-xl backdrop-blur-xs">
          <button
            onClick={() => setActiveOverlay('temp')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition ${
              activeOverlay === 'temp'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            {t.temperatureTab}
          </button>

          <button
            onClick={() => setActiveOverlay('rain')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition ${
              activeOverlay === 'rain'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            {t.rainRadarTab}
          </button>

          <button
            onClick={() => setActiveOverlay('aqi')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition ${
              activeOverlay === 'aqi'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {t.airQualityTab}
          </button>
        </div>
      </div>

      {/* SVG Regional State Map Canvas */}
      <div className={`relative w-full rounded-2xl overflow-hidden border p-2 flex justify-center items-center backdrop-blur-xs ${
        isDarkMode ? 'bg-slate-950/70 border-slate-800/60' : 'bg-sky-50/20 border-sky-100/50'
      }`}>
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-auto max-h-[480px] select-none"
        >
          <defs>
            {/* Soft Ocean Ambient Shading */}
            <linearGradient id="oceanGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="oceanGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#090d16" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0b1329" stopOpacity="0.95" />
            </linearGradient>

            {/* Tamil Nadu Landmass Gradient */}
            <linearGradient id="tnLandGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="tnLandGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0f172a" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
            </linearGradient>

            {/* Selected City Glow Filter */}
            <filter id="cityGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ocean Layer with subtle cartographic grid */}
          <rect
            x="0"
            y="0"
            width={mapWidth}
            height={mapHeight}
            fill={isDarkMode ? 'url(#oceanGradDark)' : 'url(#oceanGradLight)'}
            rx="16"
          />

          {/* Cartographic Latitude / Longitude lines (Subtle dotted) */}
          <line x1="40" y1="110" x2="580" y2="110" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="40" y1="280" x2="580" y2="280" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="40" y1="450" x2="580" y2="450" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="150" y1="30" x2="150" y2="550" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="350" y1="30" x2="350" y2="550" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />

          {/* Neighboring States (Subtle contextual land borders) */}
          {/* Andhra Pradesh (North) */}
          <path
            d="M 260 102 L 335 106 L 393 88 L 451 66 L 503 44 L 520 39 L 580 30 L 580 0 L 260 0 Z"
            fill={isDarkMode ? '#172033' : '#e2e8f0'}
            opacity="0.5"
          />
          <text x="380" y="24" fontSize="10" fontWeight="700" fill={isDarkMode ? '#64748b' : '#94a3b8'} letterSpacing="1">
            ANDHRA PRADESH
          </text>

          {/* Karnataka (North-West) */}
          <path
            d="M 87 222 L 116 214 L 162 191 L 196 182 L 237 164 L 220 111 L 260 102 L 260 0 L 80 0 L 80 150 Z"
            fill={isDarkMode ? '#172033' : '#e2e8f0'}
            opacity="0.5"
          />
          <text x="130" y="90" fontSize="10" fontWeight="700" fill={isDarkMode ? '#64748b' : '#94a3b8'} letterSpacing="1">
            KARNATAKA
          </text>

          {/* Kerala (West) */}
          <path
            d="M 87 222 L 116 267 L 133 281 L 144 325 L 179 352 L 185 388 L 173 451 L 179 519 L 214 528 L 180 550 L 70 550 L 70 220 Z"
            fill={isDarkMode ? '#172033' : '#e2e8f0'}
            opacity="0.5"
          />
          <text x="85" y="380" fontSize="10" fontWeight="700" fill={isDarkMode ? '#64748b' : '#94a3b8'} letterSpacing="1" transform="rotate(-90 85 380)">
            KERALA
          </text>

          {/* Sri Lanka (South-East across Palk Strait) */}
          <ellipse
            cx="540"
            cy="470"
            rx="45"
            ry="65"
            fill={isDarkMode ? '#1e293b' : '#e2e8f0'}
            opacity="0.6"
            stroke={isDarkMode ? '#334155' : '#cbd5e1'}
            strokeWidth="1"
          />
          <text x="540" y="474" textAnchor="middle" fontSize="9" fontWeight="700" fill={isDarkMode ? '#64748b' : '#94a3b8'} letterSpacing="0.5">
            SRI LANKA
          </text>

          {/* Accurate Tamil Nadu State Landmass Polygon */}
          <path
            d={generateBoundaryPath()}
            fill={isDarkMode ? 'url(#tnLandGradDark)' : 'url(#tnLandGradLight)'}
            stroke={isDarkMode ? '#38bdf8' : '#0284c7'}
            strokeWidth="2"
            strokeLinejoin="round"
            className="drop-shadow-md"
          />

          {/* Cauvery River System */}
          <path
            d="M 237 165 Q 234 237, 275 271 Q 347 286, 397 287 Q 440 288, 480 288"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <text x="330" y="278" fontSize="8.5" fill="#0284c7" fontWeight="600" fontStyle="italic">
            {lang === 'ta' ? 'காவிரி ஆறு' : 'Cauvery River'}
          </text>

          {/* Vaigai River */}
          <path
            d="M 180 353 Q 280 364, 363 414"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity="0.6"
          />

          {/* Western Ghats Mountain Spine representation */}
          <path
            d="M 87 223 Q 116 267, 145 326 Q 185 388, 173 451 Q 179 519, 214 528"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <text
            x="130"
            y="410"
            fontSize="9"
            fill="#10b981"
            fontWeight="bold"
            letterSpacing="0.5"
            transform="rotate(-70 130 410)"
          >
            {lang === 'ta' ? '▲ மேற்கு தொடர்ச்சி மலை ▲' : '▲ Western Ghats Ridge ▲'}
          </text>

          {/* 
            WATER BODY LABELS - Placed STRICTLY OFFSHORE in the Ocean 
            Never overlapping land, cities or pointers!
          */}

          {/* 1. Bay of Bengal (East coast ocean) */}
          <g className="select-none pointer-events-none">
            <text
              x="555"
              y="220"
              fontSize="12"
              fill={isDarkMode ? '#38bdf8' : '#0369a1'}
              fontWeight="800"
              fontStyle="italic"
              letterSpacing="1"
              textAnchor="middle"
              transform="rotate(65 555 220)"
              opacity="0.85"
            >
              {lang === 'ta' ? '~~~ வங்காள விரிகுடா ~~~' : '~~~ BAY OF BENGAL ~~~'}
            </text>
          </g>

          {/* 2. Palk Strait / Gulf of Mannar (South-East bay offshore) */}
          <g className="select-none pointer-events-none">
            <text
              x="425"
              y="385"
              fontSize="9.5"
              fill={isDarkMode ? '#38bdf8' : '#0284c7'}
              fontWeight="700"
              fontStyle="italic"
              textAnchor="middle"
              opacity="0.85"
            >
              {lang === 'ta' ? 'பாக் நீரிணை' : 'Palk Strait'}
            </text>
            <text
              x="360"
              y="475"
              fontSize="10.5"
              fill={isDarkMode ? '#38bdf8' : '#0284c7'}
              fontWeight="700"
              fontStyle="italic"
              textAnchor="middle"
              opacity="0.85"
            >
              {lang === 'ta' ? 'மன்னார் வளைகுடா' : 'Gulf of Mannar'}
            </text>
          </g>

          {/* 3. Indian Ocean (Strictly below Kanyakumari southern tip) */}
          <g className="select-none pointer-events-none">
            <text
              x="214"
              y="566"
              fontSize="12"
              fill={isDarkMode ? '#38bdf8' : '#0369a1'}
              fontWeight="800"
              fontStyle="italic"
              letterSpacing="1.2"
              textAnchor="middle"
              opacity="0.9"
            >
              {lang === 'ta' ? '~~~ இந்தியப் பெருங்கடல் ~~~' : '~~~ INDIAN OCEAN ~~~'}
            </text>
          </g>

          {/* 4. Arabian Sea (South-West offshore) */}
          <g className="select-none pointer-events-none">
            <text
              x="50"
              y="520"
              fontSize="10"
              fill={isDarkMode ? '#38bdf8' : '#0284c7'}
              fontWeight="700"
              fontStyle="italic"
              textAnchor="middle"
              opacity="0.8"
            >
              {lang === 'ta' ? 'அரபிக்கடல்' : 'Arabian Sea'}
            </text>
          </g>

          {/* 
            DISTRICT REGIONAL CITY NODES & ACCURATE POINTERS
          */}
          {mapCities.map((city) => {
            const { x, y } = getSvgCoords(city.lat, city.lng);
            const { color, stroke, icon, label } = getMetricStyleAndIcon(city);
            const isSelected = selectedCity.id === city.id;

            // Compute custom offset for text badges to avoid overlap between neighboring cities
            let badgeOffsetY = -24;
            let badgeOffsetX = 0;
            let nameOffsetY = 15;

            // Specific anti-collision tuning for close neighbor nodes
            if (city.id === 'hosur') {
              badgeOffsetX = -15;
            } else if (city.id === 'chennai') {
              badgeOffsetX = 5;
            } else if (city.id === 'cuddalore') {
              badgeOffsetX = 18;
            } else if (city.id === 'thanjavur') {
              badgeOffsetX = 15;
            } else if (city.id === 'ooty') {
              badgeOffsetX = -18;
            } else if (city.id === 'ramanathapuram') {
              badgeOffsetX = 20;
            } else if (city.id === 'thoothukudi') {
              badgeOffsetX = 20;
            } else if (city.id === 'nagercoil') {
              badgeOffsetY = -22;
              nameOffsetY = 13;
            }

            return (
              <g key={city.id} className="select-none pointer-events-none">
                {/* Active City Selection Highlight Aura */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="none"
                    stroke={color}
                    strokeWidth={2.5}
                    strokeDasharray="3 3"
                    className="animate-spin-slow"
                  />
                )}

                {/* Outer Locator Pin Glow Ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6.5 : 5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="drop-shadow-sm"
                />

                {/* Inner Core Locator Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={2}
                  fill="#ffffff"
                />

                {/* Metric Value Tag Badge */}
                <g transform={`translate(${x + badgeOffsetX}, ${y + badgeOffsetY})`}>
                  <rect
                    x="-26"
                    y="-8"
                    width="52"
                    height="16"
                    rx="5"
                    fill={isDarkMode ? '#0f172a' : '#ffffff'}
                    stroke={color}
                    strokeWidth="1.5"
                    className="drop-shadow-sm"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill={isDarkMode ? '#f8fafc' : '#0f172a'}
                  >
                    {icon} {label}
                  </text>
                </g>

                {/* City District Name Label */}
                <text
                  x={x + badgeOffsetX}
                  y={y + nameOffsetY}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight={isSelected ? '900' : '700'}
                  fill={isSelected ? '#0284c7' : isDarkMode ? '#f1f5f9' : '#0f172a'}
                  className="drop-shadow-xs"
                >
                  {lang === 'ta' ? city.tamilName : city.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Informative Legend Bar at Bottom */}
        <div className={`absolute bottom-3 left-3 right-3 sm:right-auto rounded-2xl p-2.5 px-3 border shadow-xs backdrop-blur-md transition-all ${
          isDarkMode ? 'bg-slate-900/85 border-slate-700/60 text-white' : 'bg-white/85 border-slate-200/80 text-slate-800'
        }`}>
          <div className="flex items-center gap-3 text-xs">
            {activeOverlay === 'temp' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="font-medium text-[11px]">&lt;20°C ({t.cool})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-medium text-[11px]">20-30°C ({t.warm})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-medium text-[11px]">&gt;30°C ({t.hot})</span>
                </div>
              </>
            )}

            {activeOverlay === 'rain' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="font-medium text-[11px]">{t.noRain} (Yellow)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="font-medium text-[11px]">{t.mildRain} (Blue)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="font-medium text-[11px]">{t.heavyRain} (Red)</span>
                </div>
              </>
            )}

            {activeOverlay === 'aqi' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-[11px]">{t.goodAir} (&le;50)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-medium text-[11px]">{t.moderateAir} (51-100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="font-medium text-[11px]">{t.poorAir} (&gt;100)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
