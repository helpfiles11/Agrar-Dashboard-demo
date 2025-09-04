// netlify/functions/weather.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event, context) => {
  // CORS Headers für Frontend-Zugriff
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Preflight-Request für CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // API-Key aus Umgebungsvariablen
    const API_KEY = process.env.WEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error('WEATHER_API_KEY ist nicht gesetzt');
    }

    // Stadt aus Query-Parameter oder Default
    const city = event.queryStringParameters?.city || 'Berlin';
    
    // WeatherAPI URL für aktuelle Daten + 7-Tage Forecast
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;

    console.log(`Lade Wetterdaten für: ${city}`);

    // API-Aufruf
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(`Ungültige Stadt: ${city}`);
      } else if (response.status === 401) {
        throw new Error('Ungültiger API-Key');
      } else {
        throw new Error(`WeatherAPI Fehler: ${response.status} - ${response.statusText}`);
      }
    }

    const weatherData = await response.json();

    // Daten-Struktur validieren
    if (!weatherData.current || !weatherData.location) {
      throw new Error('Unvollständige Wetterdaten erhalten');
    }

    // Optimierte Datenstruktur für Frontend
    const optimizedData = {
      location: {
        name: weatherData.location.name,
        country: weatherData.location.country,
        region: weatherData.location.region,
        localtime: weatherData.location.localtime
      },
      current: {
        temp_c: Math.round(weatherData.current.temp_c),
        condition: {
          text: weatherData.current.condition.text,
          icon: weatherData.current.condition.icon
        },
        humidity: weatherData.current.humidity,
        wind_kph: Math.round(weatherData.current.wind_kph),
        precip_mm: weatherData.current.precip_mm,
        uv: weatherData.current.uv
      },
      forecast: weatherData.forecast || null
    };

    // Erfolgreiche Antwort
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(optimizedData)
    };

  } catch (error) {
    console.error('Fehler in weather function:', error.message);
    
    // Fehler-Antwort
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
