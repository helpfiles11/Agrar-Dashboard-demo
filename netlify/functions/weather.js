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

    // Stadt und Land aus Query-Parameter
    let city = event.queryStringParameters?.city || 'Berlin';
    const selectedCountry = event.queryStringParameters?.country || 'germany';
    
    // Verbesserte Standort-Behandlung mit Länder-Mapping
    city = city.trim();
    
    // Länder-Mapping für präzise Standortsuche
    const countryMappings = {
      'germany': 'Germany',
      'austria': 'Austria', 
      'switzerland': 'Switzerland',
      'france': 'France',
      'netherlands': 'Netherlands',
      'belgium': 'Belgium',
      'denmark': 'Denmark',
      'poland': 'Poland',
      'czech': 'Czech Republic'
    };
    
    const countryName = countryMappings[selectedCountry] || 'Germany';
    
    // Deutsche PLZ-zu-Stadt-Mappings für häufige Postleitzahlen
    const germanPostalCodes = {
      '10115': 'Berlin, Germany',
      '10117': 'Berlin, Germany', 
      '10178': 'Berlin, Germany',
      '10179': 'Berlin, Germany',
      '80331': 'Munich, Germany',
      '80333': 'Munich, Germany',
      '20095': 'Hamburg, Germany',
      '20099': 'Hamburg, Germany',
      '50667': 'Cologne, Germany',
      '50668': 'Cologne, Germany',
      '60311': 'Frankfurt am Main, Germany',
      '60313': 'Frankfurt am Main, Germany',
      '70173': 'Stuttgart, Germany',
      '70174': 'Stuttgart, Germany',
      '40210': 'Dusseldorf, Germany',
      '40213': 'Dusseldorf, Germany',
      '04109': 'Leipzig, Germany',
      '04103': 'Leipzig, Germany',
      '01067': 'Dresden, Germany',
      '01069': 'Dresden, Germany',
      '30159': 'Hannover, Germany',
      '30161': 'Hannover, Germany',
      '90402': 'Nuremberg, Germany',
      '90403': 'Nuremberg, Germany',
    };
    
    // Intelligente Standort-Behandlung mit Land
    if (selectedCountry === 'germany' && germanPostalCodes[city]) {
      // Deutsche PLZ aus Mapping verwenden
      city = germanPostalCodes[city];
      console.log(`Deutsche PLZ erkannt: ${event.queryStringParameters?.city} -> ${city}`);
    } else if (/^\d{5}$/.test(city) && selectedCountry === 'germany') {
      // Deutsche PLZ fallback
      city = `${city}, ${countryName}`;
      console.log(`Deutsche PLZ behandelt: ${event.queryStringParameters?.city} -> ${city}`);
    } else if (/^\d{4}$/.test(city) && selectedCountry === 'austria') {
      // Österreichische PLZ (4-stellig)
      city = `${city}, ${countryName}`;
      console.log(`Österreichische PLZ: ${event.queryStringParameters?.city} -> ${city}`);
    } else if (/^\d{4}$/.test(city) && selectedCountry === 'switzerland') {
      // Schweizer PLZ (4-stellig) 
      city = `${city}, ${countryName}`;
      console.log(`Schweizer PLZ: ${event.queryStringParameters?.city} -> ${city}`);
    } else {
      // Stadtname mit Land
      if (!city.toLowerCase().includes(countryName.toLowerCase())) {
        city = `${city}, ${countryName}`;
      }
      console.log(`Standort mit Land: ${event.queryStringParameters?.city} -> ${city}`);
    }
    
    // WeatherAPI URL für aktuelle Daten + 7-Tage Forecast
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;

    console.log(`Lade Wetterdaten für: "${event.queryStringParameters?.city}" -> verarbeitet als: "${city}"`);

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
    
    // Log die empfangenen Standortdaten für Debugging
    if (weatherData.location) {
      console.log(`API Antwort - Standort gefunden: ${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`);
    }

    // Daten-Struktur validieren
    if (!weatherData.current || !weatherData.location) {
      console.log('Fehlerhafte API-Antwort:', JSON.stringify(weatherData, null, 2));
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
