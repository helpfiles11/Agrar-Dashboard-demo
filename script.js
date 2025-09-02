// script.js - Agrar-Dashboard JavaScript (Vollständige Version)

// Produktdatenbank
const CROPS_DATABASE = {
    weizen: {
        name: 'Weizen',
        icon: '🌾',
        optimalHumidity: { max: 60 },
        optimalTemp: { min: 22, max: 26 },
        optimalPrecip: { max: 5 },
        comment: 'Unter 18% Kornfeuchte, sonst Qualitätsverluste'
    },
    mais: {
        name: 'Mais',
        icon: '🌽',
        optimalHumidity: { max: 20 },
        optimalTemp: { min: 15, max: 30 },
        optimalPrecip: { max: 2 },
        comment: 'Bei zu hoher Luftfeuchte steigt Schimmelrisiko'
    },
    raps: {
        name: 'Raps',
        icon: '🌻',
        optimalHumidity: { max: 40 },
        optimalTemp: { min: 20, max: 25 },
        optimalPrecip: { max: 3 },
        comment: 'Sehr empfindlich, zu feucht = Auswuchsgefahr'
    },
    gerste: {
        name: 'Gerste',
        icon: '🌾',
        optimalHumidity: { max: 17 },
        optimalTemp: { min: 18, max: 24 },
        optimalPrecip: { max: 4 },
        comment: 'Malzqualität leidet bei zu hoher Feuchtigkeit'
    },
    kartoffeln: {
        name: 'Kartoffeln',
        icon: '🥔',
        optimalHumidity: { max: 75 },
        optimalTemp: { min: 10, max: 18 },
        optimalPrecip: { max: 8 },
        comment: 'Schalenfestigkeit wichtig, zu heiß = Fäulnisrisiko'
    },
    zuckerrueben: {
        name: 'Zuckerrüben',
        icon: '🪴',
        optimalHumidity: { max: 80 },
        optimalTemp: { min: 8, max: 15 },
        optimalPrecip: { max: 6 },
        comment: 'Müssen kühl geerntet werden, sonst Lagerverluste'
    },
    sonnenblumen: {
        name: 'Sonnenblumen',
        icon: '🌻',
        optimalHumidity: { max: 15 },
        optimalTemp: { min: 22, max: 28 },
        optimalPrecip: { max: 2 },
        comment: 'Ölqualität sinkt bei zu hoger Kornfeuchte'
    }
};

/**
 * WeatherManager Class - Hauptklasse für Wetterdaten-Verwaltung
 */
class WeatherManager {
    constructor() {
        this.currentLocation = 'Berlin';
        this.apiEndpoint = '/.netlify/functions/weather';
        this.selectedProducts = ['weizen', 'mais', 'sonnenblumen'];
        this.weatherData = null;
        this.cacheKey = 'agrar_weather_cache';
        this.cacheTimeout = 10 * 60 * 1000; // 10 Minuten
        
        this.init();
    }

    /**
     * Initialisierung
     */
    async init() {
        try {
            console.log('Initialisiere Agrar-Dashboard...');
            this.setupEventListeners();
            this.updateProductSelection();
            await this.loadWeatherData();
            console.log('Dashboard erfolgreich initialisiert');
        } catch (error) {
            console.error('Fehler bei der Initialisierung:', error);
            this.showError('Fehler beim Initialisieren: ' + error.message);
        }
    }

    /**
     * Event Listeners einrichten
     */
    setupEventListeners() {
        // Location Input
        const locationInput = document.getElementById('location-input');
        if (locationInput) {
            locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.updateLocation();
                }
            });
        }

        // Product Select
        const productSelect = document.getElementById('product-select');
        if (productSelect) {
            productSelect.addEventListener('change', () => {
                this.updateProductSelection();
            });
        }

        // Auto-Refresh alle 10 Minuten
        setInterval(() => {
            console.log('Auto-refresh der Wetterdaten...');
            this.loadWeatherData();
        }, 600000);
    }

    /**
     * Produktauswahl aktualisieren
     */
    updateProductSelection() {
        const select = document.getElementById('product-select');
        if (!select) return;
        
        const selectedValue = select.value;
        
        if (selectedValue === 'all') {
            this.selectedProducts = Object.keys(CROPS_DATABASE);
        } else {
            this.selectedProducts = [selectedValue];
        }
        
        console.log('Produktauswahl:', this.selectedProducts);
        
        if (this.weatherData) {
            this.generateProductCards();
        }
    }

    /**
     * Wetterdaten von API laden
     */
    async loadWeatherData() {
        try {
            console.log('Lade Wetterdaten für:', this.currentLocation);
            
            // Cache prüfen
            const cachedData = this.getCachedWeatherData();
            if (cachedData) {
                console.log('Verwende gecachte Daten');
                this.weatherData = cachedData;
                this.updateWeatherUI(cachedData);
                this.generateProductCards();
                return;
            }
            
            // API-Aufruf
            const response = await fetch(`${this.apiEndpoint}?city=${encodeURIComponent(this.currentLocation)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (!data.current || !data.location) {
                throw new Error('Unvollständige Wetterdaten');
            }
            
            console.log('Wetterdaten geladen für:', data.location.name);
            
            // Daten speichern und UI aktualisieren
            this.weatherData = data;
            this.cacheWeatherData(data);
            this.updateWeatherUI(data);
            this.generateProductCards();
            
        } catch (error) {
            console.error('Fehler beim Laden der Wetterdaten:', error);
            this.showError('Wetterdaten konnten nicht geladen werden: ' + error.message);
        }
    }

    /**
     * Weather UI aktualisieren
     */
    updateWeatherUI(data) {
        try {
            // Heute
            this.hideElement('today-loading');
            this.showElement('today-content');
            
            this.updateElement('today-temp', `${data.current.temp_c}°C`);
            this.updateElement('today-desc', data.current.condition.text);
            this.updateElement('today-humidity', `${data.current.humidity}%`);
            this.updateElement('today-wind', `${data.current.wind_kph} km/h`);
            this.updateElement('today-precipitation', `${data.current.precip_mm} mm`);
            this.updateElement('today-uv', data.current.uv || '--');
            
            // Icon für heute
            const todayIcon = document.getElementById('today-icon');
            if (todayIcon && data.current.condition.icon) {
                todayIcon.src = `https:${data.current.condition.icon}`;
                todayIcon.alt = data.current.condition.text;
            }

            // Morgen
            if (data.forecast && data.forecast.forecastday && data.forecast.forecastday.length > 1) {
                this.updateTomorrowWeather(data.forecast.forecastday[1]);
                this.updateForecast(data.forecast.forecastday);
            } else {
                this.updateTomorrowFallback(data.current);
                this.createMockForecast();
            }
            
        } catch (error) {
            console.error('Fehler beim UI Update:', error);
        }
    }

    /**
     * Morgen-Wetter aktualisieren
     */
    updateTomorrowWeather(tomorrowData) {
        this.hideElement('tomorrow-loading');
        this.showElement('tomorrow-content');
        
        const avgTemp = Math.round((tomorrowData.day.maxtemp_c + tomorrowData.day.mintemp_c) / 2);
        
        this.updateElement('tomorrow-temp', `${avgTemp}°C`);
        this.updateElement('tomorrow-desc', tomorrowData.day.condition.text);
        this.updateElement('tomorrow-minmax', 
            `${Math.round(tomorrowData.day.maxtemp_c)}°C / ${Math.round(tomorrowData.day.mintemp_c)}°C`);
        this.updateElement('tomorrow-rain-chance', `${tomorrowData.day.daily_chance_of_rain || 0}%`);
        this.updateElement('tomorrow-precipitation', `${tomorrowData.day.totalprecip_mm} mm`);
        this.updateElement('tomorrow-humidity', `${tomorrowData.day.avghumidity}%`);
        
        const tomorrowIcon = document.getElementById('tomorrow-icon');
        if (tomorrowIcon && tomorrowData.day.condition.icon) {
            tomorrowIcon.src = `https:${tomorrowData.day.condition.icon}`;
            tomorrowIcon.alt = tomorrowData.day.condition.text;
        }
    }

    /**
     * Fallback für morgen ohne Forecast-Daten
     */
    updateTomorrowFallback(currentData) {
        this.hideElement('tomorrow-loading');
        this.showElement('tomorrow-content');
        
        const estimatedTemp = currentData.temp_c + (Math.random() * 4 - 2);
        
        this.updateElement('tomorrow-temp', `${Math.round(estimatedTemp)}°C`);
        this.updateElement('tomorrow-desc', 'Ähnlich wie heute');
        this.updateElement('tomorrow-minmax', `${Math.round(estimatedTemp + 3)}°C / ${Math.round(estimatedTemp - 2)}°C`);
        this.updateElement('tomorrow-rain-chance', '20%');
        this.updateElement('tomorrow-precipitation', '0 mm');
        this.updateElement('tomorrow-humidity', `${Math.min(100, currentData.humidity + 5)}%`);
        
        const tomorrowIcon = document.getElementById('tomorrow-icon');
        if (tomorrowIcon) {
            tomorrowIcon.src = `https:${currentData.condition.icon}`;
            tomorrowIcon.alt = 'Ähnlich wie heute';
        }
    }

    /**
     * 7-Tage Forecast aktualisieren
     */
    updateForecast(forecastDays) {
        this.hideElement('forecast-loading');
        this.showElement('forecast-content');
        
        const container = document.getElementById('forecast-content');
        if (!container) return;
        
        container.innerHTML = '';
        
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const daysToShow = forecastDays.slice(1, 8);
        
        daysToShow.forEach(day => {
            const date = new Date(day.date);
            const dayName = days[date.getDay()];
            const dayDate = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <div class="forecast-date">${dayName}<br>${dayDate}</div>
                <img src="https:${day.day.condition.icon}" 
                     alt="${day.day.condition.text}" 
                     width="40" 
                     height="40">
                <div class="forecast-temps">
                    <strong>${Math.round(day.day.maxtemp_c)}°</strong> / ${Math.round(day.day.mintemp_c)}°
                </div>
                <div class="forecast-rain">${day.day.daily_chance_of_rain || 0}% Regen</div>
            `;
            
            container.appendChild(dayElement);
        });
    }

    /**
     * Mock-Forecast erstellen falls keine API-Daten
     */
    createMockForecast() {
        this.hideElement('forecast-loading');
        this.showElement('forecast-content');
        
        const container = document.getElementById('forecast-content');
        if (!container) return;
        
        container.innerHTML = '';
        
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            const dayName = days[date.getDay()];
            const dayDate = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            
            const baseTemp = this.weatherData ? this.weatherData.current.temp_c : 20;
            const tempVar = Math.random() * 6 - 3;
            const maxTemp = Math.round(baseTemp + tempVar + 3);
            const minTemp = Math.round(baseTemp + tempVar - 3);
            const rainChance = Math.round(Math.random() * 60);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <div class="forecast-date">${dayName}<br>${dayDate}</div>
                <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto;">
                    ${rainChance > 40 ? '🌧️' : (rainChance > 20 ? '⛅' : '☀️')}
                </div>
                <div class="forecast-temps">
                    <strong>${maxTemp}°</strong> / ${minTemp}°
                </div>
                <div class="forecast-rain">${rainChance}% Regen</div>
            `;
            
            container.appendChild(dayElement);
        }
    }

    /**
     * Produktkarten generieren
     */
    generateProductCards() {
        const container = document.getElementById('products-grid');
        if (!container) return;
        
        // Entferne alte Produktkarten
        const existingCards = container.querySelectorAll('.col-4');
        existingCards.forEach(card => card.remove());
        
        if (!this.weatherData) {
            console.log('Keine Wetterdaten für Produktkarten verfügbar');
            return;
        }
        
        this.selectedProducts.forEach(cropKey => {
            const crop = CROPS_DATABASE[cropKey];
            if (!crop) return;
            
            const status = this.calculateHarvestStatus(crop);
            const recommendation = this.getHarvestRecommendation(crop, status);
            
            const cardHTML = `
                <div class="col-4">
                    <div class="card product-card">
                        <h2>${crop.icon} ${crop.name}</h2>
                        <div class="product-status">
                            <span class="status-indicator ${status.class}"></span>
                            ${status.text}
                        </div>
                        <p><strong>Optimale Bedingungen:</strong></p>
                        <p>Luftfeuchtigkeit: ≤ ${crop.optimalHumidity.max}% | Temperatur: ${crop.optimalTemp.min}-${crop.optimalTemp.max}°C</p>
                        <p style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
                            ${crop.comment}
                        </p>
                        <div class="harvest-recommendation">
                            <h4>Ernteempfehlung</h4>
                            <div class="recommendation-grid">
                                <div class="recommendation-item">
                                    <div class="recommendation-label">Status</div>
                                    <div class="recommendation-value">${recommendation.when}</div>
                                </div>
                                <div class="recommendation-item">
                                    <div class="recommendation-label">Temperatur</div>
                                    <div class="recommendation-value">${this.weatherData.current.temp_c}°C</div>
                                </div>
                                <div class="recommendation-item">
                                    <div class="recommendation-label">Luftfeuchte</div>
                                    <div class="recommendation-value">${this.weatherData.current.humidity}%</div>
                                </div>
                                <div class="recommendation-item">
                                    <div class="recommendation-label">Niederschlag</div>
                                    <div class="recommendation-value">${this.weatherData.current.precip_mm} mm</div>
                                </div>
                            </div>
                            ${recommendation.reason ? `<p style="margin-top: 0.75rem; font-size: 0.875rem; color: var(--text-gray);"><strong>Grund:</strong> ${recommendation.reason}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        console.log(`${this.selectedProducts.length} Produktkarten generiert`);
    }

    /**
     * Erntest-Status berechnen
     */
    calculateHarvestStatus(crop) {
        if (!this.weatherData) {
            return { class: 'status-acceptable', text: 'Daten werden geladen...', reasons: [] };
        }
        
        const current = this.weatherData.current;
        let issues = 0;
        let reasons = [];
        
        // Temperatur prüfen
        if (current.temp_c < crop.optimalTemp.min) {
            issues++;
            reasons.push(`Zu kalt (${current.temp_c}°C)`);
        } else if (current.temp_c > crop.optimalTemp.max) {
            issues++;
            reasons.push(`Zu heiß (${current.temp_c}°C)`);
        }
        
        // Luftfeuchtigkeit prüfen
        if (current.humidity > crop.optimalHumidity.max) {
            issues++;
            reasons.push(`Zu hohe Luftfeuchtigkeit (${current.humidity}%)`);
        }
        
        // Niederschlag prüfen
        if (current.precip_mm > crop.optimalPrecip.max) {
            issues++;
            reasons.push(`Zu viel Niederschlag (${current.precip_mm}mm)`);
        }
        
        // Status bestimmen
        if (issues === 0) {
            return { class: 'status-ready', text: 'Erntebereit', reasons };
        } else if (issues === 1) {
            return { class: 'status-acceptable', text: 'Akzeptabel', reasons };
        } else {
            return { class: 'status-problematic', text: 'Problematisch', reasons };
        }
    }

    /**
     * Ernteempfehlung generieren
     */
    getHarvestRecommendation(crop, status) {
        const recommendations = {
            'status-ready': {
                when: 'Heute optimal',
                reason: 'Alle Bedingungen erfüllt'
            },
            'status-acceptable': {
                when: 'Heute möglich',
                reason: status.reasons.length > 0 ? status.reasons[0] : 'Bedingungen akzeptabel'
            },
            'status-problematic': {
                when: 'Warten empfohlen',
                reason: status.reasons.slice(0, 2).join('; ')
            }
        };
        
        return recommendations[status.class] || {
            when: 'Unbekannt',
            reason: 'Daten nicht verfügbar'
        };
    }

    /**
     * Standort aktualisieren
     */
    updateLocation() {
        const locationInput = document.getElementById('location-input');
        if (!locationInput) return;
        
        const newLocation = locationInput.value.trim();
        
        if (!newLocation) {
            this.showError('Bitte geben Sie einen gültigen Standort ein.');
            return;
        }
        
        if (newLocation === this.currentLocation) {
            console.log('Standort unverändert');
            return;
        }
        
        this.currentLocation = newLocation;
        console.log('Standort geändert zu:', newLocation);
        
        this.clearWeatherCache();
        this.resetUIToLoading();
        this.loadWeatherData();
    }

    /**
     * UI auf Loading-Zustand zurücksetzen
     */
    resetUIToLoading() {
        this.showElement('today-loading');
        this.hideElement('today-content');
        this.showElement('tomorrow-loading');
        this.hideElement('tomorrow-content');
        this.showElement('forecast-loading');
        this.hideElement('forecast-content');
        
        const container = document.getElementById('products-grid');
        if (container) {
            const existingCards = container.querySelectorAll('.col-4');
            existingCards.forEach(card => card.remove());
        }
    }

    /**
     * Cache-Funktionen
     */
    cacheWeatherData(data) {
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            location: this.currentLocation
        };
        
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Cache-Fehler:', error);
        }
    }

    getCachedWeatherData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            
            if (cacheData.location === this.currentLocation && 
                (Date.now() - cacheData.timestamp) < this.cacheTimeout) {
                return cacheData.data;
            }
            
            return null;
        } catch (error) {
            console.warn('Cache-Lesefehler:', error);
            return null;
        }
    }

    clearWeatherCache() {
        try {
            localStorage.removeItem(this.cacheKey);
        } catch (error) {
            console.warn('Cache-Löschfehler:', error);
        }
    }

    /**
     * Utility-Funktionen
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    }

    showError(message) {
        console.error('ERROR:', message);
        
        let errorElement = document.getElementById('error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.className = 'error';
            
            const container = document.querySelector('.container');
            if (container) {
                container.insertBefore(errorElement, container.firstChild);
            }
        }
        
        errorElement.innerHTML = `
            <strong>⚠️ Fehler:</strong> ${message}
            <button onclick="this.parentElement.remove()" 
                    style="float: right; background: none; border: none; color: var(--danger-red); cursor: pointer; font-size: 1.2rem;">×</button>
        `;
        
        // Auto-remove nach 10 Sekunden
        setTimeout(() => {
            if (errorElement && errorElement.parentElement) {
                errorElement.remove();
            }
        }, 10000);
    }
}

/**
 * Globale Funktionen
 */
function updateLocation() {
    if (window.weatherManager) {
        window.weatherManager.updateLocation();
    } else {
        console.error('WeatherManager nicht verfügbar');
    }
}

/**
 * Debug-Funktionen (für Entwicklung)
 */
window.debugWeather = {
    clearCache: () => {
        if (window.weatherManager) {
            window.weatherManager.clearWeatherCache();
            console.log('Cache gelöscht');
        }
    },
    getCurrentData: () => {
        return window.weatherManager ? window.weatherManager.weatherData : null;
    },
    testError: () => {
        if (window.weatherManager) {
            window.weatherManager.showError('Test-Fehlermeldung');
        }
    },
    reloadWeather: () => {
        if (window.weatherManager) {
            window.weatherManager.loadWeatherData();
        }
    }
};

/**
 * Initialisierung beim DOM-Load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM geladen, starte WeatherManager...');
    
    try {
        window.weatherManager = new WeatherManager();
        console.log('WeatherManager erfolgreich gestartet');
    } catch (error) {
        console.error('Kritischer Fehler beim Start:', error);
        
        // Fallback Error Display
        const container = document.querySelector('.container');
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.innerHTML = `
                <strong>🚨 Kritischer Fehler:</strong> JavaScript konnte nicht gestartet werden.<br>
                <strong>Details:</strong> ${error.message}<br>
                <strong>Lösung:</strong> Seite neu laden (F5)
            `;
            container.insertBefore(errorDiv, container.firstChild);
        }
    }
});

// Globale Error Handler
window.addEventListener('error', (event) => {
    console.error('Globaler JavaScript-Fehler:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unbehandelte Promise-Rejection:', event.reason);
});

console.log('script.js vollständig geladen');