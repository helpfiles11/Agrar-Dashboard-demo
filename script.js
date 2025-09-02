// script.js
async function fetchWeatherData() {
  const loadingElement = document.getElementById("loading");
  const weatherElement = document.getElementById("weather-data");
  const filteredData = {
    location: data.location.name,
    current: {
      temp_c: data.current.temp_c,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      condition: data.current.condition,
      precip_mm: data.current.precip_mm,
    },};
    localStorage.setItem("weatherData", JSON.stringify(filteredData));
  loadingElement.textContent = "Lade Wetterdaten...";

  try {
    const response = await fetch("https://agrardashboard.netlify.app/.netlify/functions/weather");
    if (!response.ok) {
      throw new Error(`Netlify-Funktion antwortete mit Fehler: ${response.status}`);
    }
    const data = await response.json();

    // Daten ins DOM schreiben
    document.getElementById("temperature").textContent = data.current.temp_c + " °C";
    document.getElementById("humidity").textContent = data.current.humidity + " %";
    document.getElementById("wind").textContent = data.current.wind_kph + " km/h";
    document.getElementById("condition").textContent = data.current.condition.text;
    document.getElementById("precipitation").textContent = data.current.precip_mm + " mm";

    // Wettericon anzeigen
    const iconUrl = `https:${data.current.condition.icon}`;
    document.getElementById("weather-icon").src = iconUrl;

    loadingElement.textContent = "";
  } catch (error) {
    loadingElement.textContent = "";
    weatherElement.innerHTML = `<p class="error">Fehler beim Laden der Wetterdaten: ${error.message}</p>`;
    console.error("API-Fehler:", error);
  }
}

// Funktion beim Laden der Seite aufrufen
document.addEventListener("DOMContentLoaded", fetchWeatherData);
