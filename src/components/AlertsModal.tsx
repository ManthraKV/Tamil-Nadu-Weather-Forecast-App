import React, { useState } from 'react';
import { X, Bell, Mail, Phone, Clock, Plus, Trash2, Send, CheckCircle2, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';
import { WeatherAlertRule, CityInfo, AppLanguage } from '../types';
import { TAMIL_NADU_CITIES } from '../data/cities';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: WeatherAlertRule[];
  onAddAlert: (newAlert: Omit<WeatherAlertRule, 'id' | 'createdAt' | 'active'>) => Promise<void>;
  onDeleteAlert: (id: string) => Promise<void>;
  isDarkMode: boolean;
  lang?: AppLanguage;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAddAlert,
  onDeleteAlert,
  isDarkMode,
  lang = 'en',
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('chennai');
  const [recipientEmail, setRecipientEmail] = useState<string>('manthra.vijayan@tigeranalytics.com');
  const [recipientPhone, setRecipientPhone] = useState<string>('+91 98765 43210');
  const [channel, setChannel] = useState<'email' | 'sms' | 'both'>('both');
  const [alertType, setAlertType] = useState<WeatherAlertRule['alertType']>('rain');
  const [frequency, setFrequency] = useState<WeatherAlertRule['frequency']>('daily');
  const [scheduledTime, setScheduledTime] = useState<string>('07:00 AM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    smsText: string;
    emailHtml: string;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const cityObj = TAMIL_NADU_CITIES.find((c) => c.id === selectedCityId) || TAMIL_NADU_CITIES[0];

    try {
      await onAddAlert({
        cityId: cityObj.id,
        cityName: cityObj.name,
        recipientEmail,
        recipientPhone,
        channel,
        alertType,
        frequency,
        scheduledTime,
      });

      // Clear or show success message
      setTestResult(null);
    } catch (err) {
      console.error('Failed to create alert:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerTest = async (alertItem?: WeatherAlertRule) => {
    const targetCity = alertItem ? alertItem.cityName : TAMIL_NADU_CITIES.find((c) => c.id === selectedCityId)?.name || 'Chennai';
    const email = alertItem ? alertItem.recipientEmail : recipientEmail;
    const phone = alertItem ? alertItem.recipientPhone : recipientPhone;

    try {
      const res = await fetch('/api/alerts/trigger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alertItem?.id,
          email,
          phone,
          cityName: targetCity,
          alertType: alertItem ? alertItem.alertType : alertType,
          tempC: 32,
          condition: 'Heavy Rain & Wind Squalls',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({
          smsText: data.previews.smsText,
          emailHtml: data.previews.emailHtml,
          message: data.message,
        });
      }
    } catch (err) {
      console.error('Trigger test failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl transition-all my-8 p-6 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Weather Alerts Setup (Email & SMS)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Receive automated SMS and Email weather advisories for any Tamil Nadu city.
            </p>
          </div>
        </div>

        {/* Alert Setup Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Target City */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Tamil Nadu City
              </label>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {TAMIL_NADU_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'ta' ? `${c.tamilName} (${c.name})` : `${c.name} (${c.district} District)`}
                  </option>
                ))}
              </select>
            </div>

            {/* Alert Condition Type */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Weather Alert Condition
              </label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="rain">Heavy Rainfall Warning (&gt; 30mm)</option>
                <option value="cyclone">Cyclone & Severe Wind Advisory</option>
                <option value="temp_high">Extreme High Temperature (&gt; 38°C)</option>
                <option value="aqi">Air Quality (AQI) Unhealthy Warning</option>
                <option value="daily_summary">Daily Morning Briefing</option>
              </select>
            </div>
          </div>

          {/* Contact Details: Email & SMS Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Recipient Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Recipient Mobile Number (SMS)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Delivery Channel & Schedule Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Dispatch Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="both">Email + Mobile SMS</option>
                <option value="sms">SMS Only</option>
                <option value="email">Email Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Frequency Setup
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="daily">Daily Scheduled</option>
                <option value="one_time">One-Time Setup</option>
                <option value="scheduled">Event Threshold Trigger</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Dispatch Time
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="07:00 AM"
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-sky-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Register Weather Alert</span>
            </button>

            <button
              type="button"
              onClick={() => handleTriggerTest()}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>Test SMS / Email Trigger</span>
            </button>
          </div>
        </form>

        {/* Live Test Dispatch Preview Modal Card */}
        {testResult && (
          <div className="mb-6 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 space-y-3">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{testResult.message}</span>
            </div>

            {/* Simulated SMS Preview Bubble */}
            <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono border border-slate-700">
              <div className="flex items-center gap-1.5 text-sky-400 font-sans font-bold mb-1 text-[11px]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulated Mobile SMS Message:</span>
              </div>
              <p className="leading-relaxed text-[11px]">{testResult.smsText}</p>
            </div>
          </div>
        )}

        {/* Configured Active Alerts List */}
        <div>
          <h3 className="font-bold text-sm mb-3 text-slate-700 dark:text-slate-300">
            Active Configured Alerts ({alerts.length})
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {alerts.map((a) => (
              <div
                key={a.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition ${
                  isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{a.cityName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                      {a.alertType.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {a.channel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Email: {a.recipientEmail || 'N/A'} • SMS: {a.recipientPhone || 'N/A'} ({a.scheduledTime})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerTest(a)}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold transition"
                  >
                    Test Send
                  </button>
                  <button
                    onClick={() => onDeleteAlert(a.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 transition"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <p className="text-center py-4 text-xs text-slate-500">
                No active weather alerts configured yet. Fill out the form above to register one.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
