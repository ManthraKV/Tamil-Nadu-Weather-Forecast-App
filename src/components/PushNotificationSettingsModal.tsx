import React, { useState } from 'react';
import { X, Bell, Volume2, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { NotificationSettings } from '../types';

interface PushNotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  isDarkMode: boolean;
}

export const PushNotificationSettingsModal: React.FC<PushNotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isDarkMode,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTogglePush = async () => {
    if (!settings.pushEnabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateSettings({ ...settings, pushEnabled: true });
        setToastMessage('Real-time push notifications enabled successfully!');
      } else {
        alert('Browser notification permission was denied. Please enable notifications in your browser settings.');
      }
    } else {
      onUpdateSettings({ ...settings, pushEnabled: !settings.pushEnabled });
      setToastMessage(!settings.pushEnabled ? 'Push notifications enabled.' : 'Push notifications disabled.');
    }
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⛈️ Tamil Nadu Weather Alert', {
        body: 'Real-time notification active: Moderate monsoon showers expected in Chennai & Delta region today.',
        icon: '/favicon.ico',
      });
    }

    setToastMessage('Test push notification sent! Check browser alert.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl transition-all p-6 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Push Notification Preferences</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure real-time desktop & mobile browser alerts.
            </p>
          </div>
        </div>

        {toastMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Push Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="font-bold text-xs block">Browser Push Notifications</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant popups for sudden rain & warnings
                </span>
              </div>
            </div>
            <button
              onClick={handleTogglePush}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                settings.pushEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.pushEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-sky-500" />
              <div>
                <span className="font-bold text-xs block">Notification Sound Effect</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Audio chime when critical alert arrives
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                settings.soundEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Cyclone / Severe Warning Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <div>
                <span className="font-bold text-xs block">Cyclone & High Wind Warnings</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  High priority alerts for coastal Tamil Nadu
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, cycloneAlerts: !settings.cycloneAlerts })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                settings.cycloneAlerts ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.cycloneAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Test Trigger Button */}
          <button
            onClick={handleTestNotification}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md"
          >
            Trigger Test Push Notification
          </button>
        </div>
      </div>
    </div>
  );
};
