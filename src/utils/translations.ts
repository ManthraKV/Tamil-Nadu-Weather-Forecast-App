import { WeatherCondition, TNRegion } from '../types';

export type AppLanguage = 'en' | 'ta';

export const TRANSLATIONS = {
  en: {
    appTitle: 'Tamil Nadu Weather',
    appSubtitle: 'Tamil Nadu State Meteorological Service',
    stateTag: 'TN State',
    searchPlaceholder: 'Search TN City or District...',
    allTN: 'All Districts',
    gps: 'GPS',
    weatherAlerts: 'Weather Alerts',
    pushSettings: 'Push Notification Settings',
    shareDeploy: 'Share & Deploy',
    toggleTheme: 'Toggle Theme',
    language: 'Language',
    
    // East-West Sun Widget
    east: 'EAST',
    west: 'WEST',
    eastTamil: 'கிழக்கு',
    westTamil: 'மேற்கு',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    dawnSubtitle: 'Dawn • Morning Sun Horizon',
    duskSubtitle: 'Dusk • Evening Twilight Horizon',
    solarPosition: 'Solar Position',
    daylightRemaining: 'Daylight Track',

    // Current Weather Card
    feelsLike: 'Feels like',
    updated: 'Updated',
    highLow: 'H/L',
    rainfall24h: 'Rainfall (24h)',
    barometer: 'Barometer',
    visibility: 'Visibility',
    cloudCover: 'Cloud Cover',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    uvIndex: 'UV Index',
    airQuality: 'Air Quality',
    
    // Hourly Forecast
    hourlyTitle: "Today's 24-Hour Forecast",
    hourlySubtitle: 'Comprehensive hourly temperature, precipitation & wind patterns',
    rainProbability: 'Rain Prob.',
    wind: 'Wind',
    now: 'Now',

    // 5-Day Dashboard
    dashboardTitle: '5-Day & 7-Day Weather Dashboard',
    dashboardSubtitle: 'Extended Tamil Nadu Outlook',
    precipitation: 'Precipitation',
    uvMax: 'UV Max',
    today: 'Today',
    tomorrow: 'Tomorrow',

    // Regional Map
    mapTitle: 'Tamil Nadu Regional Map',
    mapSubtitle: 'District overview across Tamil Nadu',
    temperatureTab: 'Temperature',
    rainRadarTab: 'Rain Radar',
    airQualityTab: 'Air Quality',
    noRain: 'No Rain',
    mildRain: 'Mild Rain',
    heavyRain: 'Heavy Rain',
    goodAir: 'Good',
    moderateAir: 'Moderate',
    poorAir: 'Poor',
    cool: 'Cool',
    warm: 'Warm',
    hot: 'Hot',

    // Footer
    footerTitle: 'Tamil Nadu State Meteorological Service',
    footerSubtitle: 'Providing hourly forecasts, weather advisories, and SMS/Email alerts across all 38 districts of Tamil Nadu.',
    footerShare: 'Public Shareable URL & Deploy Guide',
    footerAlerts: 'SMS / Email Alerts Setup',
  },
  ta: {
    appTitle: 'தமிழ்நாடு வானிலை',
    appSubtitle: 'தமிழ்நாடு மாநில வானிலை மையம்',
    stateTag: 'தமிழகம்',
    searchPlaceholder: 'நகரம், தமிழ் பெயர் அல்லது மாவட்டம் தேடுக...',
    allTN: 'அனைத்து மாவட்டங்கள்',
    gps: 'ஜிபிஎஸ்',
    weatherAlerts: 'வானிலை எச்சரிக்கைகள்',
    pushSettings: 'அறிவிப்பு அமைப்புகள்',
    shareDeploy: 'பகிர்வு & வெளியீடு',
    toggleTheme: 'தீம் மாற்றம்',
    language: 'மொழி',

    // East-West Sun Widget
    east: 'கிழக்கு',
    west: 'மேற்கு',
    eastTamil: 'EAST',
    westTamil: 'WEST',
    sunrise: 'சூரிய உதயம்',
    sunset: 'சூரிய அஸ்தமனம்',
    dawnSubtitle: 'விடியற்காலை • உதய சூரியன்',
    duskSubtitle: 'அந்தி மாலை • மறைவு சூரியன்',
    solarPosition: 'சூரிய நிலை',
    daylightRemaining: 'பகல் வெளிச்ச பாதை',

    // Current Weather Card
    feelsLike: 'உணரும் வெப்பநிலை',
    updated: 'புதுப்பிக்கப்பட்டது',
    highLow: 'உயர்/குறைவு',
    rainfall24h: 'மழைப்பொழிவு (24 மணி)',
    barometer: 'காற்றழுத்தம்',
    visibility: 'பார்வைத்திறன்',
    cloudCover: 'மேகமூட்டம்',
    humidity: 'ஈரப்பதம்',
    windSpeed: 'காற்றின் வேகம்',
    uvIndex: 'புற ஊதா குறியீடு',
    airQuality: 'காற்றுத் தரம்',

    // Hourly Forecast
    hourlyTitle: 'இன்றைய 24 மணி நேர முன்னறிவிப்பு',
    hourlySubtitle: 'மணிநேர வெப்பநிலை, மழைப்பொழிவு மற்றும் காற்றின் வேகம்',
    rainProbability: 'மழை வாய்ப்பு',
    wind: 'காற்று',
    now: 'இப்போது',

    // 5-Day Dashboard
    dashboardTitle: '5 நாள் மற்றும் 7 நாள் வானிலை கண்ணோட்டம்',
    dashboardSubtitle: 'நீட்டிக்கப்பட்ட தமிழக வானிலை கண்ணோட்டம்',
    precipitation: 'மழைப்பொழிவு',
    uvMax: 'அதிகபட்ச UV',
    today: 'இன்று',
    tomorrow: 'நாளை',

    // Regional Map
    mapTitle: 'தமிழ்நாடு பிராந்திய வரைபடம்',
    mapSubtitle: 'தமிழ்நாடு மாவட்ட வானிலை கண்ணோட்டம்',
    temperatureTab: 'வெப்பநிலை',
    rainRadarTab: 'மழை ரேடார்',
    airQualityTab: 'காற்றுத் தரம்',
    noRain: 'மழை இல்லை',
    mildRain: 'மிதமான மழை',
    heavyRain: 'கனமழை',
    goodAir: 'நன்று',
    moderateAir: 'மிதமானது',
    poorAir: 'மோசமானது',
    cool: 'குளிர்',
    warm: 'வெப்பம்',
    hot: 'அதிவெப்பம்',

    // Footer
    footerTitle: 'தமிழ்நாடு வானிலை மையம் • TN State Meteorological Service',
    footerSubtitle: 'தமிழ்நாட்டின் 38 மாவட்டங்களுக்கும் மணிநேர முன்னறிவிப்பு, வானிலை எச்சரிக்கை மற்றும் SMS/மின்னஞ்சல் அறிவிப்புகள்.',
    footerShare: 'பகிர்வு முகவரி & வெளியீட்டு வழிகாட்டி',
    footerAlerts: 'SMS / மின்னஞ்சல் எச்சரிக்கை அமைப்பு',
  },
};

export const CONDITION_TRANSLATIONS: Record<WeatherCondition, { en: string; ta: string }> = {
  Clear: { en: 'Clear Skies', ta: 'தெளிவான வானம்' },
  'Partly Cloudy': { en: 'Partly Cloudy', ta: 'பகுதி மேகமூட்டம்' },
  Cloudy: { en: 'Overcast Cloudy', ta: 'முழு மேகமூட்டம்' },
  'Light Rain': { en: 'Light Drizzle / Rain', ta: 'மிதமான தூறல் / மழை' },
  'Heavy Rain': { en: 'Heavy Monsoon Rain', ta: 'கனமழை பொழிவு' },
  Thunderstorm: { en: 'Thunderstorm with Lightning', ta: 'இடியுடன் கூடிய பலத்த மழை' },
  'Mist/Fog': { en: 'Morning Mist / Fog', ta: 'காலை பனிமூட்டம்' },
  Breezy: { en: 'Breezy Wind', ta: 'தென்றல் காற்று' },
  Hazy: { en: 'Hazy Sunshine', ta: 'மங்கலான வெயில்' },
};

export const REGION_TRANSLATIONS: Record<TNRegion, { en: string; ta: string }> = {
  'Coastal TN': { en: 'Coastal TN', ta: 'கடற்கரை பகுதி' },
  'Western Ghats / Hills': { en: 'Western Ghats / Hills', ta: 'மேற்கு தொடர்ச்சி / மலைகள்' },
  'Cauvery Delta': { en: 'Cauvery Delta', ta: 'காவிரி டெல்டா' },
  'Northern TN': { en: 'Northern TN', ta: 'வட தமிழ்நாடு' },
  'Southern TN': { en: 'Southern TN', ta: 'தென் தமிழ்நாடு' },
  'Western Plains': { en: 'Western Plains', ta: 'மேற்கு சமவெளி' },
};
