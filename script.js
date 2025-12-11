const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');

const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');

const forecastDiv = document.getElementById('forecast');
const forecastTitle = document.getElementById('forecast-title');

statusDiv.style.display = 'none';
forecastTitle.style.display = 'none';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(1)

    const city = cityInput.value;
    statusDiv.style.display = 'block';
    forecastDiv.innerHTML = "";

    searchCity(city)
    .then(response => {
        const geocodingResponse = response.json();
        return geocodingResponse;
    }).then(location => {
        statusDiv.style.display = 'none';
        cityName.textContent = `${location.results[0].name}`;
        return {
            lat: location.results[0].latitude,
            long: location.results[0].longitude
        }
    }).then(city => {
        return getWeather(city.lat, city.long);
    }).then(weatherResult => {
        temperature.textContent = `Temperature: ${weatherResult.current_weather.temperature} ${weatherResult.current_weather_units.temperature}`;
        forecastTitle.style.display = 'block';
        const date = weatherResult.daily.time;
        const tempMax = weatherResult.daily.temperature_2m_max;
        const tempMin = weatherResult.daily.temperature_2m_min;
        for(let i = 0; i < date.length; i++){
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('forecast-day');
            dayDiv.innerHTML = `
                <h3>${date[i]}</h3>
                <p>Max: ${tempMax[i]} ${weatherResult.daily_units.temperature_2m_max}</p>
                <p>Min: ${tempMin[i]} ${weatherResult.daily_units.temperature_2m_min}</p>
            `;
            forecastDiv.appendChild(dayDiv);
        }
    
    
    }).catch(error => {
        statusDiv.style.display = 'none';
        cityName.textContent = ``;
        forecastTitle.style.display = 'none';
        temperature.textContent = `Місто не знайдено`;
    });
});

function searchCity(city){
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
}

function getWeather(lat, long){
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`).then(response => {return response.json();});
}