const aussieCities = {
    brisbane: { lat: -27.4679, lon: 153.0281 },
    perth: { lat: -31.9522, lon: 115.8614 },
    melbourne: { lat: -37.8714, lon: 144.9633 },
    sydney: { lat: -33.8678, lon: 151.2073 },
    adelaide: { lat: -34.9287, lon: 138.5986 }
} as const;

type AussieCity = keyof typeof aussieCities;

const wmoRainRules = {
    0:  { desc: "Clear sky", rainGear: "None needed" },
    1:  { desc: "Mainly clear", rainGear: "None needed" },
    2:  { desc: "Partly cloudy", rainGear: "None needed" },
    3:  { desc: "Overcast", rainGear: "None needed" },
    45: { desc: "Foggy", rainGear: "None needed" },
    48: { desc: "Depositing rime fog", rainGear: "None needed" },
    
    51: { desc: "Light drizzle", rainGear: "Umbrella" },
    53: { desc: "Moderate drizzle", rainGear: "Raincoat and waterproof shoes" },
    55: { desc: "Dense drizzle", rainGear: "Raincoat and waterproof shoes" },

    56: { desc: "Slight Freezing drizzle", rainGear: "Raincoat and waterproof shoes" },
    57: { desc: "Dense Freezing drizzle", rainGear: "Raincoat and waterproof shoes" },

    61: { desc: "Slight rain", rainGear: "Umbrella" },
    63: { desc: "Moderate rain", rainGear: "Raincoat and waterproof shoes" },
    65: { desc: "Heavy rain", rainGear: "Raincoat and waterproof shoes" },

    66: { desc: "Slight Freezing rain", rainGear: "Raincoat and waterproof shoes" },
    67: { desc: "Heavy Freezing rain", rainGear: "Raincoat and waterproof shoes" },

    71: { desc: "Slight snowfall", rainGear: "Waterproof snow gloves and boots" },
    73: { desc: "Moderate snowfall", rainGear: "Insulated snow pants and waterproof gloves" },
    75: { desc: "Heavy snowfall", rainGear: "Heavy-duty snow gear and slip-resistant boots" },
    77: { desc: "Snow grains", rainGear: "Protective winter eyewear and a beanie" },

    80: { desc: "Slight rain showers", rainGear: "Umbrella" },
    81: { desc: "Moderate rain showers", rainGear: "Raincoat and waterproof shoes" },
    82: { desc: "Violent rain showers", rainGear: "Raincoat and waterproof shoes" },

    85: { desc: "Slight snow showers", rainGear: "Raincoat and waterproof shoes" },
    86: { desc: "Violent snow showers", rainGear: "Raincoat and waterproof shoes" },
    
    95: { desc: "Thunderstorm", rainGear: "Raincoat and seek indoor shelter" }
} as const;

type WmoCode = keyof typeof wmoRainRules;

const citySelect = document.getElementById('citySelect') as HTMLSelectElement;
const getWeatherBtn = document.getElementById('getWeatherBtn');
const packingResult = document.getElementById('packingResult');

async function getPlan(cityName: AussieCity) {
    const coordinates = aussieCities[cityName];
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,weather_code&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const currentTemp = data.current.temperature_2m;
        const currentCode = data.current.weather_code;

        let tempPack = "";
        if (currentTemp < 15) {
            tempPack = "Sweater, scarf, and warm layers.";
        } else if (currentTemp >= 15 && currentTemp <= 25) {
            tempPack = "Light jacket, jeans, and casual layers.";
        } else {
            tempPack = "Sunglasses, sunscreen, and light summer clothes.";
        }

        const weatherMatch = wmoRainRules[currentCode as keyof typeof wmoRainRules] || { desc: "Clear conditions", rainGear: "None needed" };
        let rainPack = weatherMatch.rainGear;

        if (packingResult){packingResult.innerHTML = `
            <h3>Destination: ${cityName.toUpperCase()}</h3>
            <p><strong>Temperature:</strong> ${currentTemp}°C</p>
            <p><strong>Weather Condition:</strong> ${weatherMatch.desc}</p>
            <hr style="border: 0.5px solid #444; margin: 15px 0;">
            <p><strong>Packing:</strong> ${tempPack}</p>
            <p><strong>Rain:</strong> ${rainPack}</p>
        `;} else
            {console.error("Could not find the packingResult element in the DOM!");
          }

    } catch (error) {
        const errorDisplay = document.getElementById('packingResult');
        if (errorDisplay) {
            errorDisplay.innerHTML = `<p style="color: red;">Error contacting weather grid.</p>`;
        } else {
            console.error("Could not find packingResult element to show the error message.");
        }
        console.error("API Error: ", error);
    }
}

if (getWeatherBtn) {getWeatherBtn.addEventListener('click', () => {
    getPlan(citySelect.value as AussieCity);
    });
    }     
    else {
        console.error("Could not find getWeatherBtn element in the DOM.");
    }
;

getPlan("brisbane");