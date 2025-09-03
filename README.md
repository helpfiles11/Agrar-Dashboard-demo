# 🌾 Agrar-Dashboard

Ein modernes, responsives Dashboard für Landwirte zur Überwachung von Wetterdaten für die Planung des besten Erntezeitpunktes. 

## 🚀 Live Demo

**[https://agrardashboard.netlify.app/](https://agrardashboard.netlify.app/)**

## 📋 Projektübersicht

Das Agrar-Dashboard ist eine webbasierte Anwendung, die Landwirten dabei hilft, wichtige Informationen für ihre tägliche Arbeit zentral und übersichtlich einzusehen. Die Anwendung bietet Echtzeit-Wetterdaten, Bodenfeuchtigkeitsüberwachung und intelligente Empfehlungen für optimale Erntezeitpunkte.

## ✨ Features

### 🌤️ Wettermodul
- **Aktuelle Wetterdaten**: Temperatur, Luftfeuchtigkeit, Windgeschwindigkeit
- **7-Tage Wettervorhersage**: Detaillierte Prognosen für die Wochenplanung
- **Wettertrends**: Visualisierung von Temperatur- und Niederschlagsverläufen
- **Warnmeldungen**: Automatische Benachrichtigungen bei extremen Wetterbedingungen

### 🌱 Ernte- & Feldmanagement
- **Ernteempfehlungen**: KI-basierte Vorschläge basierend auf Wetterdaten und Pflanzentyp
- **Bodenfeuchtigkeitsüberwachung**: Realtime-Daten mit Bewässerungsempfehlungen
- **Ernteplaner**: Optimale Zeitpunkte für Aussaat, Pflege und Ernte

### 📊 Dashboard & Analytics
- **Interaktive Diagramme**: Wettertrends und Feldstatistiken
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Dunkler/Heller Modus**: Benutzerfreundliche Darstellung zu jeder Tageszeit
- **Echtzeit-Updates**: Automatische Aktualisierung aller Daten

## 🛠️ Technische Details

### Frontend
- **HTML5/CSS3**: Moderne, semantic Markup und Styling
- **Vanilla JavaScript**: Keine Framework-Abhängigkeiten für maximale Performance
- **Chart.js**: Professionelle Datenvisualisierung
- **CSS Grid & Flexbox**: Responsives Layout-System
- **CSS Custom Properties**: Dynamische Themes und Styling

### Backend & APIs
- **Node.js**: Serverless Functions für API-Integration
- **OpenWeatherMap API**: Zuverlässige Wetterdaten
- **RESTful Architecture**: Saubere API-Struktur
- **Error Handling**: Robuste Fehlerbehandlung und Fallbacks

### Deployment & Infrastructure
- **Netlify**: Automatische Deployments und Hosting
- **Git Integration**: Kontinuierliche Integration über GitHub
- **Environment Variables**: Sichere API-Key-Verwaltung
- **Performance Optimization**: Minimierte Assets und Caching

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (>= 18.0.0)
- npm oder yarn
- OpenWeatherMap API-Key

### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone https://github.com/helpfiles11/Agrar-Dashboard-demo.git
   cd Agrar-Dashboard-demo
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   # .env Datei erstellen
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   # oder für Produktion
   npm start
   ```

### Deployment

Das Projekt ist für automatische Deployments auf Netlify konfiguriert:

```bash
# Produktions-Deployment
npm run deploy
```

## 📁 Projektstruktur

```
Agrar-Dashboard/
├── index.html              # Hauptseite
├── index.js                # Backend/API Logic
├── package.json            # Projekt-Konfiguration
├── .env                    # Umgebungsvariablen (local)
├── .gitignore             # Git-Ignorierte Dateien
├── netlify.toml           # Netlify-Konfiguration
├── assets/
│   ├── css/
│   │   └── styles.css     # Haupt-Stylesheet
│   └── js/
│       └── main.js        # Frontend JavaScript
└── docs/
    └── README.md          # Diese Datei
```

## 🔧 Konfiguration

### API-Keys
Die Anwendung benötigt einen OpenWeatherMap API-Key. Dieser kann kostenlos unter [openweathermap.org](https://openweathermap.org/api) erhalten werden.

### Umgebungsvariablen
```env
OPENWEATHER_API_KEY=your_openweather_api_key
NODE_ENV=production
```

## 🌟 Key Features im Detail

### Wettermodul
- Integration mit OpenWeatherMap API
- Automatische Standorterkennung
- Historische Wetterdaten
- Extrem Wetter-Alerts

### Ernteoptimierung
- Algorithmus zur Bestimmung optimaler Erntezeitpunkte
- Berücksichtigung von Wetterprognosen
- Pflanzenspezifische Empfehlungen
- Integration von Bodendaten

### Performance & UX
- Progressive Web App (PWA) Features
- Offline-Funktionalität für Kernfeatures
- Schnelle Ladezeiten durch optimierte Assets
- Intuitive Benutzerführung

## 📱 Browser-Unterstützung

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Graceful Degradation für ältere Browser

## 🤝 Entwicklung & Contribution

### Code-Qualität
- ESLint für JavaScript-Linting
- Prettier für Code-Formatting
- Semantische Commit-Messages
- Code-Reviews vor Merges

### Testing
```bash
# Tests ausführen
npm test

# Linting
npm run lint

# Code-Formatting
npm run format
```

## 📈 Roadmap & Geplante Features

### Version 2.1
- [ ] Satellitendaten-Integration
- [ ] Erweiterte Bodenanalyse
- [ ] Multi-Language Support
- [ ] Mobile App (React Native)
- [ ] KI-basierte Ertragsprognosen

## 📄 Lizenz

Dieses Projekt steht unter der GPL-Lizenz. Siehe [LICENSE](LICENSE) für weitere Details.

## 👥 Credits & Acknowledgments

- **Entwicklung**: helpfiles11
- **Design**: Moderne UI/UX Prinzipien
- **APIs**: OpenWeatherMap
- **Hosting**: Netlify
- **Icons**: Font Awesome, Custom SVGs

## 📞 Support & Kontakt

- **GitHub Issues**: [Project Issues](https://github.com/helpfiles11/Agrar-Dashboard-demo/issues)
- **Repository**: [GitHub Repository](https://github.com/helpfiles11/Agrar-Dashboard-demo)
- **Live Demo**: [agrardashboard.netlify.app](https://agrardashboard.netlify.app/)

---

*Ein Open-Source Projekt für die moderne Landwirtschaft* 🚜

**Made with ❤️ for farmers and agricultural innovation**
