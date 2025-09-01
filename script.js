async function fetchWeatherData(city) {
  try {
    const response = await fetch(`/.netlify/functions/weather?city=${city}`);
    if (!response.ok) {
      throw new Error(`Fehler: ${response.status}`);
    }
    const data = await response.json();
    // Daten in die HTML-Elemente einfügen
    document.getElementById('location-name').textContent = data.location.name;
    document.getElementById('temperature').textContent = data.current.temp_c;
    document.getElementById('weather-condition').textContent = data.current.condition.text;
    document.getElementById('wind-speed').textContent = data.current.wind_kph;
    document.getElementById('humidity').textContent = data.current.humidity;
    document.getElementById('precipitation').textContent = data.current.precip_mm;
    document.getElementById('weather-icon').src = data.current.condition.icon;
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
      <p><strong>Temperatur:</strong> ${weatherData.current.temp_c}°C</p>
      <p><strong>Luftfeuchtigkeit:</strong> ${weatherData.current.humidity}%</p>
      <p><strong>Niederschlag:</strong> ${weatherData.current.precip_mm} mm</p>
      <p><strong>Bedingungen:</strong> ${weatherData.current.condition.text}</p>
    `;
  } else {
    weatherElement.innerHTML = 'Wetterdaten konnten nicht geladen werden.';
  }
}

// Beispielaufruf für Berlin
displayWeather('Berlin');

// Wetterdaten beim Laden der Seite abrufen
window.onload = fetchWeatherData;
