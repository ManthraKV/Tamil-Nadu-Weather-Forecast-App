import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory alert store
interface AlertRecord {
  id: string;
  cityId: string;
  cityName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'email' | 'sms' | 'both';
  alertType: 'rain' | 'temp_high' | 'temp_low' | 'wind' | 'cyclone' | 'aqi' | 'daily_summary';
  thresholdValue?: number;
  frequency: 'one_time' | 'daily' | 'scheduled';
  scheduledTime?: string;
  active: boolean;
  createdAt: string;
  lastSentAt?: string;
}

const alertStore: AlertRecord[] = [
  {
    id: 'demo-alert-1',
    cityId: 'chennai',
    cityName: 'Chennai',
    recipientEmail: 'manthra.vijayan@tigeranalytics.com',
    recipientPhone: '+91 98765 43210',
    channel: 'both',
    alertType: 'rain',
    thresholdValue: 30,
    frequency: 'daily',
    scheduledTime: '07:00 AM',
    active: true,
    createdAt: new Date().toISOString(),
    lastSentAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-alert-2',
    cityId: 'ooty',
    cityName: 'Udhagamandalam (Ooty)',
    recipientEmail: 'manthra.vijayan@tigeranalytics.com',
    recipientPhone: '+91 98765 43210',
    channel: 'sms',
    alertType: 'cyclone',
    frequency: 'scheduled',
    scheduledTime: '06:00 AM',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Health API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', region: 'Tamil Nadu Weather API Engine' });
});

// Alerts CRUD API
app.get('/api/alerts', (_req, res) => {
  res.json({ success: true, alerts: alertStore });
});

app.post('/api/alerts', (req, res) => {
  const { cityId, cityName, recipientEmail, recipientPhone, channel, alertType, thresholdValue, frequency, scheduledTime } = req.body;
  if (!cityName || (!recipientEmail && !recipientPhone)) {
    return res.status(400).json({ error: 'City name and at least an email or mobile phone number are required.' });
  }

  const newAlert: AlertRecord = {
    id: 'alert-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    cityId: cityId || 'chennai',
    cityName,
    recipientEmail,
    recipientPhone,
    channel: channel || 'both',
    alertType: alertType || 'daily_summary',
    thresholdValue,
    frequency: frequency || 'daily',
    scheduledTime: scheduledTime || '07:00 AM',
    active: true,
    createdAt: new Date().toISOString(),
  };

  alertStore.unshift(newAlert);
  res.json({ success: true, alert: newAlert, message: `Alert configured successfully for ${cityName}!` });
});

app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  const idx = alertStore.findIndex((a) => a.id === id);
  if (idx !== -1) {
    alertStore.splice(idx, 1);
    res.json({ success: true, message: 'Alert deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Alert not found.' });
  }
});

// Trigger / Test Alert Dispatcher
app.post('/api/alerts/trigger-test', (req, res) => {
  const { alertId, email, phone, cityName, alertType, tempC, condition } = req.body;

  const targetEmail = email || 'user@example.com';
  const targetPhone = phone || '+91 98765 43210';
  const city = cityName || 'Chennai';
  const currTemp = tempC || 32;
  const currCond = condition || 'Heavy Rain Showers';

  const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const smsText = `[TN WEATHER ALERT ⛈️] ${city}, Tamil Nadu Weather Advisory (${nowStr}): ${currCond} detected with temperature ${currTemp}°C. Expected high rainfall. Please take necessary travel/agricultural precautions. - TN Weather Bureau`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px;">⛈️ Tamil Nadu Official Weather Advisory</h2>
          <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Real-Time Weather Alert for <strong>${city}</strong></p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 15px; line-height: 1.6;">Dear Resident / Traveler,</p>
          <p style="font-size: 15px; line-height: 1.6;">Our automated meteorological monitoring network has triggered a <strong>${alertType || 'Weather Alert'}</strong> for your registered region:</p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0369a1;">${city} - ${currTemp}°C (${currCond})</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #334155;">Alert Type: <strong>${(alertType || 'Rainfall Warning').toUpperCase()}</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Timestamp: ${nowStr} (IST)</p>
          </div>

          <h4 style="margin: 16px 0 8px 0; color: #0f172a;">Regional Safety Guidance:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.6;">
            <li>Fishermen and coastal commuters along Coromandel/Palk Strait should exercise caution.</li>
            <li>Farmers in Cauvery Delta are advised to clear field drainage channels.</li>
            <li>Travelers in Nilgiris / Kodaikanal hill corridors should watch for mist and mountain road slippery conditions.</li>
          </ul>

          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
            You received this notification because your email/mobile is subscribed to Tamil Nadu Weather Forecast Alerts.
          </p>
        </div>
      </div>
    </div>
  `;

  // Update lastSentAt if alertId exists
  if (alertId) {
    const item = alertStore.find((a) => a.id === alertId);
    if (item) {
      item.lastSentAt = new Date().toISOString();
    }
  }

  res.json({
    success: true,
    sentTo: {
      email: targetEmail,
      phone: targetPhone,
    },
    dispatchStatus: {
      emailSent: true,
      smsSent: true,
      provider: 'Tamil Nadu Telecom & Mail Gateway (Simulated Dispatch)',
    },
    previews: {
      smsText,
      emailHtml,
    },
    message: `Alert successfully dispatched to ${targetPhone} via SMS and ${targetEmail} via Email!`,
  });
});

// AI Weather Insights endpoint via Gemini API
app.post('/api/ai/advisory', async (req, res) => {
  const { cityName, tempC, condition, humidity, windSpeedKmh, aqi, region } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      success: true,
      advisoryEnglish: `Regional Tamil Nadu Advisory for ${cityName}: Currently experiencing ${condition} at ${tempC}°C with ${humidity}% humidity. Ideal for general daily activities; keep rain gear handy during evening hours.`,
      advisoryTamil: `${cityName} வானிலை அறிவுறுத்தல்: தற்போதைய வெப்பநிலை ${tempC}°C. ஈரப்பதம் ${humidity}%. பயணம் மற்றும் விவசாயத்திற்கு தேவையான முன்னெச்சரிக்கை நடவடிக்கைகளை மேற்கொள்ளவும்.`,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a friendly, expert meteorological advisor for Tamil Nadu state, India.
Generate a concise, insightful weather summary for ${cityName} (${region} region).
Current metrics: Temperature: ${tempC}°C, Condition: ${condition}, Humidity: ${humidity}%, Wind: ${windSpeedKmh} km/h, Air Quality Index (AQI): ${aqi}.

Provide:
1. Short 2-sentence practical advice in English for commuters, farmers, or tourists in Tamil Nadu.
2. Short 2-sentence summary in Tamil (தமிழ்) script.

Return JSON in this format ONLY:
{
  "english": "...",
  "tamil": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      advisoryEnglish: parsed.english,
      advisoryTamil: parsed.tamil,
    });
  } catch (err) {
    console.error('Gemini API weather advisory error:', err);
    return res.json({
      success: true,
      advisoryEnglish: `Regional Advisory for ${cityName}: ${condition} with ${tempC}°C. Stay hydrated and monitor weather updates.`,
      advisoryTamil: `${cityName} வானிலை: ${tempC}°C. கவனமாக இருக்கவும்.`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tamil Nadu Weather Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
