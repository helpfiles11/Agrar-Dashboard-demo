// netlify/functions/weather.js
const axios = require('axios');
// /netlify/functions/weather.js
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache für 10 Minuten

exports.handler = async (event) => {
  const API_KEY = process.env.WEATHER_API_KEY;
  const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Berlin&aqi=no`;

  // Prüfe, ob Daten im Cache sind
  const cachedData = cache.get("weatherData");
  if (cachedData) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cachedData),
    };
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`WeatherAPI Fehler: ${response.status}`);
    }
    const data = await response.json();

    // Speichere Daten im Cache
    cache.set("weatherData", data);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Fehler in der Netlify-Funktion:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

exports.handler = async function(event, context) {
  const API_KEY = process.env.WEATHER_API_KEY; // Wird später in Netlify hinterlegt
  const city = event.queryStringParameters.city || 'Berlin';
  const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

  try {
    const response = await axios.get(URL);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Abrufen der Wetterdaten' })
    };
  }
};
