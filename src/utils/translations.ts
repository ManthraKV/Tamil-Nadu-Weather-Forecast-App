import { WeatherCondition, TNRegion } from '../types';

export type AppLanguage = 'en' | 'ta';

export const TRANSLATIONS = {
  en: {
    appTitle: 'Tamil Nadu Weather',
    appSubtitle: 'Tamil Nadu State Meteorological Service',
    stateTag: 'TN State',
    searchPlaceholder: 'Search any city, district, or town...',
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
    dawnSubtitle: 'Dawn • Morning Ocean Horizon',
    duskSubtitle: 'Dusk • Evening Ocean Horizon',
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

    // 7-Day Forecast Dashboard
    dashboardTitle: '7-Day Weather Forecast',
    dashboardSubtitle: 'Extended 7-day outlook powered by Open-Meteo',
    precipitation: 'Precipitation',
    uvMax: 'UV Max',
    today: 'Today',
    tomorrow: 'Tomorrow',

    // Planning Recommendations
    planningTitle: 'Smart Day & Travel Planning Recommendations',
    planningSubtitle: 'Actionable guidance based on live temperature, precipitation & UV conditions',
    outdoorFitness: 'Outdoor & Exercise',
    travelCommute: 'Travel & Commute',
    clothingCare: 'Clothing & UV Protection',
    coastalFarming: 'Farming & Coastal Advisory',
    bestTimeOut: 'Ideal Outdoor Window',

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
    selectedStationLegend: 'Selected District / Active Station Tracking',

    // Footer
    footerTitle: 'Tamil Nadu State Meteorological Service',
    footerSubtitle: 'Providing hourly forecasts, 7-day outlooks, weather advisories, and SMS/Email alerts across all 38 districts of Tamil Nadu.',
    footerShare: 'Public Shareable URL & Deploy Guide',
    footerAlerts: 'SMS / Email Alerts Setup',
  },
  ta: {
    appTitle: 'தமிழ்நாடு வானிலை',
    appSubtitle: 'தமிழ்நாடு மாநில வானிலை மையம்',
    stateTag: 'தமிழகம்',
    searchPlaceholder: 'நகரம் அல்லது மாவட்டம் தேடுக...',
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
    dawnSubtitle: 'விடியற்காலை • உதய கடல் தொடுவானம்',
    duskSubtitle: 'அந்தி மாலை • மறைவு கடல் தொடுவானம்',
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

    // 7-Day Forecast Dashboard
    dashboardTitle: '7 நாள் வானிலை முன்னறிவிப்பு',
    dashboardSubtitle: 'Open-Meteo வழங்கும் நீட்டிக்கப்பட்ட 7 நாள் முன்னறிவிப்பு',
    precipitation: 'மழைப்பொழிவு',
    uvMax: 'அதிகபட்ச UV',
    today: 'இன்று',
    tomorrow: 'நாளை',

    // Planning Recommendations
    planningTitle: 'திட்டமிடல் மற்றும் பயண வழிகாட்டுதல்கள்',
    planningSubtitle: 'வெப்பநிலை, மழை மற்றும் UV நிலைகளின் அடிப்படையிலான நடைமுறை ஆலோசனைகள்',
    outdoorFitness: 'வெளிப்புற உடற்பயிற்சி & நடைபயிற்சி',
    travelCommute: 'பயணம் மற்றும் போக்குவரத்து',
    clothingCare: 'ஆடை மற்றும் UV பாதுகாப்பு',
    coastalFarming: 'விவசாயம் மற்றும் கடலோர ஆலோசனை',
    bestTimeOut: 'சிறந்த வெளிப்புற நேரம்',

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
    selectedStationLegend: 'தேர்ந்தெடுக்கப்பட்ட மாவட்டம் (சுழலும் வட்டம்)',

    // Footer
    footerTitle: 'தமிழ்நாடு வானிலை மையம் • TN State Meteorological Service',
    footerSubtitle: 'தமிழ்நாட்டின் 38 மாவட்டங்களுக்கும் மணிநேர முன்னறிவிப்பு, 7 நாள் முன்னறிவிப்பு, வானிலை எச்சரிக்கை மற்றும் SMS/மின்னஞ்சல் அறிவிப்புகள்.',
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
