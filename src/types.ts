export type WeatherCondition =
  | 'Clear'
  | 'Partly Cloudy'
  | 'Cloudy'
  | 'Light Rain'
  | 'Heavy Rain'
  | 'Thunderstorm'
  | 'Mist/Fog'
  | 'Breezy'
  | 'Hazy';

export type TNRegion =
  | 'Coastal TN'
  | 'Western Ghats / Hills'
  | 'Cauvery Delta'
  | 'Northern TN'
  | 'Southern TN'
  | 'Western Plains';

export interface CityInfo {
  id: string;
  name: string;
  tamilName: string;
  district: string;
  region: TNRegion;
  lat: number;
  lng: number;
  elevationMeters: number;
  description: string;
  popularFor: string;
}

export interface HourlyForecast {
  time: string; // e.g. "10:00 AM"
  hour24: number; // 0-23
  tempC: number;
  feelsLikeC: number;
  condition: WeatherCondition;
  icon: string;
  rainProbability: number; // 0-100
  precipitationMm: number;
  windSpeedKmh: number;
  windDirection: string;
  humidity: number; // 0-100
  uvIndex: number;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy';
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayName: string; // "Today", "Mon", "Tue"...
  fullDateStr: string; // "Aug 11, 2026"
  minTempC: number;
  maxTempC: number;
  condition: WeatherCondition;
  icon: string;
  rainProbability: number;
  totalPrecipitationMm: number;
  maxWindSpeedKmh: number;
  avgHumidity: number;
  uvIndexMax: number;
  sunriseTime: string;
  sunsetTime: string;
  summary: string;
  alertWarning?: string;
}

export interface CurrentWeather {
  city: CityInfo;
  updatedAt: string;
  tempC: number;
  feelsLikeC: number;
  condition: WeatherCondition;
  isDay: boolean;
  minTempC: number;
  maxTempC: number;
  humidity: number;
  windSpeedKmh: number;
  windDirection: string;
  pressureHpa: number;
  visibilityKm: number;
  uvIndex: number;
  uvStatus: string;
  aqi: number;
  aqiLabel: string;
  sunrise: string;
  sunset: string;
  dewPointC: number;
  rainfall24hMm: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aiAdvisory?: string;
  aiAdvisoryTamil?: string;
}

export interface WeatherAlertRule {
  id: string;
  cityId: string;
  cityName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'email' | 'sms' | 'both';
  alertType: 'rain' | 'temp_high' | 'temp_low' | 'wind' | 'cyclone' | 'aqi' | 'daily_summary';
  thresholdValue?: number;
  frequency: 'one_time' | 'daily' | 'scheduled';
  scheduledTime?: string; // e.g. "07:00 AM"
  active: boolean;
  createdAt: string;
  lastSentAt?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  cycloneAlerts: boolean;
  heavyRainAlerts: boolean;
  dailyBriefing: boolean;
  briefingTime: string;
}
