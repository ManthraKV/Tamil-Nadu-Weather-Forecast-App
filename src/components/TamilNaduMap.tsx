import React, { useState } from 'react';
import { MapPin, Thermometer, CloudRain, ShieldAlert, Navigation } from 'lucide-react';
import { CityInfo, AppLanguage } from '../types';
import { TAMIL_NADU_CITIES } from '../data/cities';
import { TRANSLATIONS } from '../utils/translations';

interface TamilNaduMapProps {
  selectedCity: CityInfo;
  onSelectCity?: (city: CityInfo) => void;
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  selectedCity,
  onSelectCity,
  isDarkMode,
  lang = 'en',
}) => {
  const [activeOverlay, setActiveOverlay] = useState<'temp' | 'rain' | 'aqi'>('temp');
  const t = TRANSLATIONS[lang];

  // SVG Canvas dimensions
  const mapWidth = 660;
  const mapHeight = 620;

  // Accurate Mercator projection matching Tamil Nadu & surrounding region bounds
  // Lat: 7.6°N (Southern Sri Lanka / Indian Ocean) to 13.8°N (Andhra border / Tirupati)
  // Lng: 75.8°E (Kerala coast / Lakshadweep sea) to 81.8°E (Eastern Sri Lanka / Bay of Bengal)
  const getSvgCoords = (lat: number, lng: number) => {
    const minLat = 7.6;
    const maxLat = 13.8;
    const minLng = 75.8;
    const maxLng = 81.8;

    const marginX = 25;
    const marginY = 25;
    const drawWidth = mapWidth - marginX * 2;
    const drawHeight = mapHeight - marginY * 2;

    const x = marginX + ((lng - minLng) / (maxLng - minLng)) * drawWidth;
    const y = marginY + ((maxLat - lat) / (maxLat - minLat)) * drawHeight;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  // High precision boundary points for Tamil Nadu State
  const tnBoundaryGeo: [number, number][] = [
    [13.55, 80.20], // Pulicat Lake
    [13.30, 80.32], // Ennore
    [13.08, 80.28], // Chennai Marina
    [12.75, 80.24], // Kovalam
    [12.50, 80.16], // Mahabalipuram
    [12.18, 79.98], // Marakkanam
    [11.95, 79.83], // Puducherry enclave border
    [11.60, 79.77], // Cuddalore
    [11.45, 79.78], // Parangipettai / Porto Novo
    [11.15, 79.85], // Poompuhar / Sirkazhi
    [10.92, 79.84], // Karaikal enclave border
    [10.76, 79.85], // Nagapattinam
    [10.68, 79.85], // Velankanni
    [10.30, 79.86], // Point Calimere (Kodiakkarai Hook)
    [10.28, 79.48], // Muthupet Lagoon
    [9.98, 79.18],  // Manamelkudi
    [9.60, 78.95],  // Mimisal / Devipattinam
    [9.32, 79.15],  // Uchipuli / Mandapam spit
    [9.28, 79.31],  // Pamban Island entry
    [9.18, 79.43],  // Dhanushkodi Cape Tip (Ram Setu origin)
    [9.22, 79.28],  // Rameswaram South
    [9.15, 78.85],  // Sayalgudi
    [9.10, 78.50],  // Vembar
    [8.76, 78.16],  // Thoothukudi VOC Port
    [8.50, 78.05],  // Tiruchendur
    [8.38, 77.95],  // Kulasekharapatnam
    [8.18, 77.72],  // Koodankulam
    [8.08, 77.55],  // Kanyakumari Cape Comorin
    [8.18, 77.25],  // Colachel
    [8.35, 77.20],  // Marthandam / Kuzhithurai
    [8.55, 77.22],  // Pechiparai / Shenkottai
    [8.95, 77.10],  // Courtallam / Tenkasi Western Ghats
    [9.35, 77.20],  // Rajapalayam / Srivilliputhur
    [9.75, 77.30],  // Megamalai / Varusanadu
    [10.05, 77.25], // Bodinayakkanur / Theni
    [10.35, 76.95], // Valparai / Anaimalai
    [10.65, 76.90], // Pollachi West
    [10.85, 76.85], // Palghat Gap (Coimbatore West)
    [11.10, 76.65], // Siruvani Hills
    [11.45, 76.45], // Nilgiris Gudalur / Devala
    [11.62, 76.70], // Mudumalai / Moyar
    [11.85, 77.10], // Sathyamangalam / Hasanur
    [11.98, 77.45], // Bargur Hills
    [12.15, 77.75], // Hogenakkal Cauvery Gorge
    [12.60, 77.60], // Denkanikottai
    [12.75, 77.60], // Hosur Bulge
    [12.85, 77.95], // Krishnagiri North
    [12.80, 78.60], // Vaniyambadi / Jolarpettai
    [13.00, 79.10], // Vellore / Katpadi North
    [13.25, 79.60], // Arakkonam / Tiruttani
    [13.50, 80.05], // Thiruvallur North
  ];

  // High precision boundary points for Sri Lanka
  const sriLankaBoundaryGeo: [number, number][] = [
    [9.83, 80.24], // Point Pedro (Northernmost tip)
    [9.66, 80.01], // Jaffna Peninsula North
    [9.55, 79.85], // Kayts / Karaitivu
    [9.30, 80.00], // Pooneryn
    [9.05, 79.72], // Talaimannar (Pointing towards Dhanushkodi)
    [8.95, 79.90], // Mannar Island South
    [8.50, 79.80], // Kalpitiya Peninsula
    [8.00, 79.70], // Puttalam Lagoon
    [7.50, 79.80], // Chilaw
    [7.20, 79.85], // Negombo
    [6.93, 79.85], // Colombo
    [6.50, 79.95], // Kalutara
    [6.05, 80.20], // Galle
    [5.92, 80.55], // Dondra Head (Southern tip)
    [6.15, 81.12], // Hambantota
    [6.50, 81.70], // Yala National Park Coast
    [7.00, 81.85], // Arugam Bay
    [7.70, 81.70], // Batticaloa
    [8.58, 81.23], // Trincomalee Bay
    [8.90, 80.95], // Mullaitivu
    [9.40, 80.50], // Elephant Pass
    [9.80, 80.35], // Vadamarachchi
  ];

  // Convert array of geo-points to SVG polygon path
  const generatePathFromGeo = (geoPoints: [number, number][]) => {
    return geoPoints.map((pt, i) => {
      const { x, y } = getSvgCoords(pt[0], pt[1]);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  // Metric calculation helpers per city
  const getCityTemp = (city: CityInfo): number => {
    if (city.elevationMeters > 1500) return 16;
    if (city.elevationMeters > 1000) return 20;
    if (city.region === 'Coastal TN') return 31;
    if (city.id === 'madurai' || city.id === 'trichy' || city.id === 'vellore') return 36;
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

  const getMetricStyleAndIcon = (city: CityInfo) => {
    if (activeOverlay === 'temp') {
      const temp = getCityTemp(city);
      const icon = '🌡️';
      const label = `${temp}°C`;
      if (temp <= 20) return { color: '#eab308', stroke: '#ca8a04', icon, label, bgClass: 'bg-yellow-500' };
      if (temp <= 30) return { color: '#f59e0b', stroke: '#d97706', icon, label, bgClass: 'bg-amber-500' };
      if (temp <= 33) return { color: '#f97316', stroke: '#ea580c', icon, label, bgClass: 'bg-orange-500' };
      return { color: '#ef4444', stroke: '#dc2626', icon, label, bgClass: 'bg-rose-500' };
    }

    if (activeOverlay === 'rain') {
      const rain = getCityRainProb(city);
      const icon = '🌧️';
      const label = `${rain}%`;
      if (rain <= 15) return { color: '#eab308', stroke: '#ca8a04', icon, label, bgClass: 'bg-yellow-500' };
      if (rain <= 55) return { color: '#0284c7', stroke: '#0369a1', icon, label, bgClass: 'bg-sky-500' };
      return { color: '#ef4444', stroke: '#dc2626', icon, label, bgClass: 'bg-rose-600' };
    }

    const aqi = getCityAqi(city);
    const icon = '🍃';
    const label = `AQI ${aqi}`;
    if (aqi <= 50) return { color: '#10b981', stroke: '#059669', icon, label, bgClass: 'bg-emerald-500' };
    if (aqi <= 100) return { color: '#f59e0b', stroke: '#d97706', icon, label, bgClass: 'bg-amber-500' };
    return { color: '#ef4444', stroke: '#dc2626', icon, label, bgClass: 'bg-rose-600' };
  };

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

  // Compute selected city coordinate
  const selCoords = getSvgCoords(selectedCity.lat, selectedCity.lng);

  return (
    <div
      id="tamil-nadu-map-container"
      className={`rounded-3xl border p-4 sm:p-5 transition-all shadow-xs backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800/80 text-slate-100'
          : 'bg-white/80 border-slate-200/90 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500" />
            <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
              {t.mapTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Overlay Metric Toggles */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl backdrop-blur-xs border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveOverlay('temp')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
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
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
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
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
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
        isDarkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-sky-50/40 border-sky-100/80'
      }`}>
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-auto max-h-[520px] select-none"
        >
          <defs>
            {/* Ocean Gradients */}
            <linearGradient id="oceanGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="oceanGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080e1a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
            </linearGradient>

            {/* Tamil Nadu Landmass Gradient */}
            <linearGradient id="tnLandGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="tnLandGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#111827" stopOpacity="0.99" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.98" />
            </linearGradient>

            {/* Surrounding States Gradient */}
            <linearGradient id="neighborLandLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="neighborLandDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141d2e" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>

            {/* Sri Lanka Landmass Gradient */}
            <linearGradient id="sriLankaGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="sriLankaGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#142820" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f2018" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* 1. Background Ocean Canvas */}
          <rect
            x="0"
            y="0"
            width={mapWidth}
            height={mapHeight}
            fill={isDarkMode ? 'url(#oceanGradDark)' : 'url(#oceanGradLight)'}
            rx="16"
          />

          {/* Cartographic Coordinate Graticule */}
          <line x1="25" y1="90" x2="635" y2="90" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="25" y1="260" x2="635" y2="260" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="25" y1="440" x2="635" y2="440" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="180" y1="25" x2="180" y2="595" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />
          <line x1="390" y1="25" x2="390" y2="595" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.4" />

          {/* 2. Surrounding States with High-Definition Outlines */}
          
          {/* ANDHRA PRADESH (North) */}
          <path
            d="M 230 100 L 320 105 L 375 80 L 440 55 L 485 35 L 530 25 L 650 25 L 650 0 L 230 0 Z"
            fill={isDarkMode ? 'url(#neighborLandDark)' : 'url(#neighborLandLight)'}
            stroke={isDarkMode ? '#475569' : '#94a3b8'}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <g className="select-none pointer-events-none">
            <text x="375" y="28" fontSize="11" fontWeight="800" fill={isDarkMode ? '#94a3b8' : '#64748b'} letterSpacing="1.2">
              ANDHRA PRADESH (ஆந்திரா)
            </text>
            <text x="375" y="42" fontSize="8.5" fontWeight="600" fill={isDarkMode ? '#64748b' : '#94a3b8'} fontStyle="italic">
              Tirupati • Chittoor • Nellore
            </text>
          </g>

          {/* KARNATAKA (North-West) */}
          <path
            d="M 75 240 L 98 232 L 140 205 L 175 195 L 210 175 L 195 118 L 230 100 L 230 0 L 0 0 L 0 240 Z"
            fill={isDarkMode ? 'url(#neighborLandDark)' : 'url(#neighborLandLight)'}
            stroke={isDarkMode ? '#475569' : '#94a3b8'}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <g className="select-none pointer-events-none">
            <text x="75" y="80" fontSize="11" fontWeight="800" fill={isDarkMode ? '#94a3b8' : '#64748b'} letterSpacing="1.2">
              KARNATAKA (கர்நாடகா)
            </text>
            <text x="75" y="94" fontSize="8.5" fontWeight="600" fill={isDarkMode ? '#64748b' : '#94a3b8'} fontStyle="italic">
              Bengaluru • Mysuru • Chamarajanagar
            </text>
          </g>

          {/* KERALA (West) */}
          <path
            d="M 75 240 L 98 285 L 115 305 L 125 345 L 158 375 L 165 410 L 150 470 L 158 535 L 190 545 L 155 570 L 0 570 L 0 240 Z"
            fill={isDarkMode ? 'url(#neighborLandDark)' : 'url(#neighborLandLight)'}
            stroke={isDarkMode ? '#475569' : '#94a3b8'}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <g className="select-none pointer-events-none">
            <text
              x="55"
              y="385"
              fontSize="11"
              fontWeight="800"
              fill={isDarkMode ? '#94a3b8' : '#64748b'}
              letterSpacing="1.2"
              transform="rotate(-90 55 385)"
            >
              KERALA (கேரளா)
            </text>
            <text
              x="72"
              y="385"
              fontSize="8.5"
              fontWeight="600"
              fill={isDarkMode ? '#64748b' : '#94a3b8'}
              fontStyle="italic"
              transform="rotate(-90 72 385)"
            >
              Palakkad • Kochi • Thiruvananthapuram
            </text>
          </g>

          {/* 3. SRI LANKA (Defined Precise Teardrop Landmass across Palk Strait) */}
          <g className="select-none pointer-events-none">
            <path
              d={generatePathFromGeo(sriLankaBoundaryGeo)}
              fill={isDarkMode ? 'url(#sriLankaGradDark)' : 'url(#sriLankaGradLight)'}
              stroke={isDarkMode ? '#10b981' : '#059669'}
              strokeWidth="1.8"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            
            {/* Sri Lanka Mountain Central Highlands */}
            <ellipse
              cx="545"
              cy="530"
              rx="18"
              ry="25"
              fill="none"
              stroke={isDarkMode ? '#34d399' : '#10b981'}
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />

            {/* Sri Lanka Title & Major Cities */}
            <text x="550" y="475" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={isDarkMode ? '#34d399' : '#047857'} letterSpacing="0.8">
              SRI LANKA
            </text>
            <text x="550" y="488" textAnchor="middle" fontSize="9" fontWeight="700" fill={isDarkMode ? '#6ee7b7' : '#059669'}>
              (இலங்கை)
            </text>
            <text x="515" y="415" textAnchor="middle" fontSize="8" fontWeight="600" fill={isDarkMode ? '#94a3b8' : '#64748b'}>
              Jaffna (யாழ்ப்பாணம்)
            </text>
            <text x="475" y="465" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={isDarkMode ? '#94a3b8' : '#64748b'}>
              Talaimannar
            </text>
            <text x="575" y="445" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={isDarkMode ? '#94a3b8' : '#64748b'}>
              Trincomalee
            </text>
            <text x="505" y="555" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={isDarkMode ? '#94a3b8' : '#64748b'}>
              Colombo (கொழும்பு)
            </text>

            {/* Adam's Bridge / Ram Setu (Shoals connecting Dhanushkodi to Talaimannar) */}
            <line
              x1="435"
              y1="465"
              x2="465"
              y2="467"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="2 3"
            />
            <text x="448" y="480" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#f59e0b" fontStyle="italic">
              {lang === 'ta' ? 'ஆதாம் பாலம் (Ram Setu)' : "Adam's Bridge (Ram Setu)"}
            </text>
          </g>

          {/* 4. TAMIL NADU STATE LANDMASS (High Definition) */}
          <path
            d={generatePathFromGeo(tnBoundaryGeo)}
            fill={isDarkMode ? 'url(#tnLandGradDark)' : 'url(#tnLandGradLight)'}
            stroke={isDarkMode ? '#38bdf8' : '#0284c7'}
            strokeWidth="2.2"
            strokeLinejoin="round"
            className="drop-shadow-md"
          />

          {/* Internal Region Boundaries & Distinct Geography */}
          {/* Cauvery River System with Delta Branches */}
          <path
            d="M 210 175 Q 212 235, 250 270 Q 320 285, 370 286 Q 425 287, 460 287"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Cauvery Kollidam Branch */}
          <path
            d="M 320 285 Q 380 265, 450 260"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <text x="295" y="278" fontSize="8.5" fill="#0284c7" fontWeight="700" fontStyle="italic">
            {lang === 'ta' ? 'காவிரி ஆறு (Cauvery)' : 'Cauvery River Basin'}
          </text>

          {/* Vaigai River */}
          <path
            d="M 158 375 Q 255 385, 335 435"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.6"
            strokeDasharray="3 2"
            opacity="0.75"
          />
          <text x="245" y="388" fontSize="8" fill="#0284c7" fontWeight="600" fontStyle="italic">
            {lang === 'ta' ? 'வைகை ஆறு (Vaigai)' : 'Vaigai River'}
          </text>

          {/* Thamirabarani River */}
          <path
            d="M 150 470 Q 185 480, 260 488"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.4"
            opacity="0.7"
          />
          <text x="180" y="474" fontSize="7.5" fill="#0284c7" fontWeight="600" fontStyle="italic">
            {lang === 'ta' ? 'தாமிரபரணி' : 'Thamirabarani'}
          </text>

          {/* Western Ghats Ridge Spine */}
          <path
            d="M 75 240 Q 98 285, 125 345 Q 165 410, 150 470 Q 158 535, 190 545"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <text
            x="110"
            y="435"
            fontSize="9"
            fill="#10b981"
            fontWeight="bold"
            letterSpacing="0.5"
            transform="rotate(-70 110 435)"
          >
            {lang === 'ta' ? '▲ மேற்கு தொடர்ச்சி மலை ▲' : '▲ Western Ghats Ridge ▲'}
          </text>

          {/* Puducherry & Karaikal Union Territory Badges */}
          <circle cx="452" cy="195" r="4" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
          <text x="460" y="198" fontSize="8" fontWeight="800" fill="#ec4899">
            Puducherry (புதுச்சேரி)
          </text>
          <circle cx="454" cy="275" r="3.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
          <text x="462" y="278" fontSize="7.5" fontWeight="800" fill="#ec4899">
            Karaikal (காரைக்கால்)
          </text>

          {/* 
            OFFSHORE SEAS & WATER BODIES
          */}
          {/* Bay of Bengal (East coast ocean) */}
          <g className="select-none pointer-events-none">
            <text
              x="570"
              y="220"
              fontSize="12"
              fill={isDarkMode ? '#38bdf8' : '#0369a1'}
              fontWeight="800"
              fontStyle="italic"
              letterSpacing="1.2"
              textAnchor="middle"
              transform="rotate(65 570 220)"
              opacity="0.85"
            >
              {lang === 'ta' ? '~~~ வங்காள விரிகுடா ~~~' : '~~~ BAY OF BENGAL ~~~'}
            </text>
          </g>

          {/* Palk Strait / Gulf of Mannar */}
          <g className="select-none pointer-events-none">
            <text
              x="420"
              y="380"
              fontSize="9.5"
              fill={isDarkMode ? '#38bdf8' : '#0284c7'}
              fontWeight="800"
              fontStyle="italic"
              textAnchor="middle"
              opacity="0.9"
            >
              {lang === 'ta' ? 'பாக் நீரிணை (Palk Strait)' : 'Palk Strait'}
            </text>
            <text
              x="345"
              y="490"
              fontSize="10.5"
              fill={isDarkMode ? '#38bdf8' : '#0284c7'}
              fontWeight="800"
              fontStyle="italic"
              textAnchor="middle"
              opacity="0.9"
            >
              {lang === 'ta' ? 'மன்னார் வளைகுடா (Gulf of Mannar)' : 'Gulf of Mannar'}
            </text>
          </g>

          {/* Indian Ocean (Strictly below Kanyakumari southern tip) */}
          <g className="select-none pointer-events-none">
            <text
              x="200"
              y="600"
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

          {/* Arabian Sea (South-West offshore) */}
          <g className="select-none pointer-events-none">
            <text
              x="45"
              y="535"
              fontSize="10"
              fill={isDarkMode ? '#38bdf8' : '#0284c7'}
              fontWeight="800"
              fontStyle="italic"
              textAnchor="middle"
              opacity="0.85"
            >
              {lang === 'ta' ? 'அரபிக்கடல்' : 'Arabian Sea'}
            </text>
          </g>

          {/* 
            DISTRICT REGIONAL CITY NODES & PINS
          */}
          {mapCities.map((city) => {
            const { x, y } = getSvgCoords(city.lat, city.lng);
            const { color, icon, label } = getMetricStyleAndIcon(city);
            const isSelected = selectedCity.id === city.id;

            // Offset tuning to prevent badge collisions
            let badgeOffsetY = -24;
            let badgeOffsetX = 0;
            let nameOffsetY = 15;

            if (city.id === 'hosur') badgeOffsetX = -15;
            else if (city.id === 'chennai') badgeOffsetX = 5;
            else if (city.id === 'cuddalore') badgeOffsetX = 18;
            else if (city.id === 'thanjavur') badgeOffsetX = 15;
            else if (city.id === 'ooty') badgeOffsetX = -18;
            else if (city.id === 'ramanathapuram') badgeOffsetX = 20;
            else if (city.id === 'thoothukudi') badgeOffsetX = 20;
            else if (city.id === 'nagercoil') {
              badgeOffsetY = -22;
              nameOffsetY = 13;
            }

            return (
              <g
                key={city.id}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectCity && onSelectCity(city)}
              >
                {/* 
                  MOVING DOTTED CIRCLE: Active City Live Telemetry Indicator 
                  (Representing the active weather station currently selected by user)
                */}
                {isSelected && (
                  <g className="select-none pointer-events-none">
                    {/* Outer Rotating Dotted Aura */}
                    <circle
                      cx={x}
                      cy={y}
                      r={15}
                      fill="none"
                      stroke={color}
                      strokeWidth={2.5}
                      strokeDasharray="3 3"
                      className="animate-spin-slow"
                    />
                    {/* Inner Pulse Ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r={19}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.2}
                      opacity="0.4"
                      className="animate-ping"
                    />
                  </g>
                )}

                {/* Outer Pin Locator Ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 7 : 5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="drop-shadow-sm"
                />

                {/* Inner White Dot */}
                <circle cx={x} cy={y} r={2} fill="#ffffff" />

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

                {/* District Name Label */}
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

        {/* Informative Map Legend Bar at Bottom (Including Moving Dotted Circle Legend) */}
        <div className={`absolute bottom-3 left-3 right-3 rounded-2xl p-2.5 px-3.5 border shadow-sm backdrop-blur-md transition-all ${
          isDarkMode ? 'bg-slate-900/90 border-slate-700/70 text-white' : 'bg-white/90 border-slate-200/90 text-slate-800'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            
            {/* Metric Ranges */}
            <div className="flex items-center gap-3">
              {activeOverlay === 'temp' && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="font-medium text-[11px]">&le;20°C ({t.cool})</span>
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
                    <span className="font-medium text-[11px]">{t.noRain} (&le;15%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span className="font-medium text-[11px]">{t.mildRain} (16-55%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    <span className="font-medium text-[11px]">{t.heavyRain} (&gt;55%)</span>
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

            {/* DEDICATED MOVING DOTTED CIRCLE LEGEND BADGE */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-500/15 dark:bg-sky-400/15 border border-sky-400/30 text-sky-700 dark:text-sky-300 font-bold text-[11px]">
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full border border-dashed border-sky-500 dark:border-sky-400 animate-spin-slow" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              </div>
              <span>
                {t.selectedStationLegend} ({selectedCity.name})
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
