import React from 'react';
import tnSunriseLightBg from '../assets/images/tn_colorful_sunrise_light_1786512969923.jpg';
import tnSunsetDarkBg from '../assets/images/tn_colorful_sunset_dark_1786512996359.jpg';

interface CulturalBackgroundLayerProps {
  isDarkMode: boolean;
}

export const CulturalBackgroundLayer: React.FC<CulturalBackgroundLayerProps> = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Image Canvas Layer with Smooth Mode Transition */}
      <div className="absolute inset-0">
        <img
          src={isDarkMode ? tnSunsetDarkBg : tnSunriseLightBg}
          alt="Tamil Nadu Sunrise and Sunset Background"
          className="w-full h-full object-cover transition-all duration-700 opacity-40 dark:opacity-45 scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Mode Gradient Overlay */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90'
            : 'bg-gradient-to-b from-amber-100/60 via-amber-50/50 to-orange-50/70'
        }`}
      />

      {/* LIGHT MODE: Vibrant Golden Sunrise Rays & Kolam Vectors */}
      {!isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-12 left-4 w-64 h-64 border-2 border-dashed border-amber-600 rounded-full animate-spin-slow opacity-60 flex items-center justify-center">
            <div className="w-44 h-44 border border-amber-700 rotate-45 transform" />
            <div className="w-28 h-28 border-2 border-amber-600 rounded-full" />
          </div>
          <div className="absolute top-96 right-4 w-72 h-72 border-2 border-dashed border-amber-700 rounded-full animate-spin-slow opacity-60 flex items-center justify-center">
            <div className="w-52 h-52 border border-amber-800 rotate-12 transform" />
            <div className="w-32 h-32 border-2 border-amber-600 rounded-full" />
          </div>
        </div>
      )}

      {/* DARK MODE: Glowing Village Agal Vilakku Oil Lamp Pulses */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl animate-pulse" />
        </div>
      )}
    </div>
  );
};
