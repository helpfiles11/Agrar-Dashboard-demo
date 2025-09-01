// netlify/functions/weather.js
const axios = require('axios');

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
