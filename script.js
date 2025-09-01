// script.js
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`/.netlify/functions/weather?city=${city}`);
    if (!response.ok) {
      throw new Error(`Fehler: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Wetterdaten:', error);
    return null;
  }
}

async function displayWeather(city) {
  const weatherData = await fetchWeatherData(city);
  const weatherElement = document.getElementById('weather-data');

  if (weatherData) {
    weatherElement.innerHTML = `
      <p>Temperatur: ${weatherData.current.temp_c}°C</p>
      <p>Luftfeuchtigkeit: ${weatherData.current.humidity}%</p>
      <p>Niederschlag: ${weatherData.current.precip_mm} mm</p>
    `;
  } else {
    weatherElement.innerHTML = 'Wetterdaten konnten nicht geladen werden.';
  }
}

// Beispielaufruf
displayWeather('Berlin');

