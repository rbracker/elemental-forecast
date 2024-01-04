async function fetchWeather(cityName) {
    const apiKey = 'd7e52e98046df3ba1be2ce6ff1a2d0e8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }

        const data = await response.json(); // Parse JSON response
        handleWeatherData(data);
    } catch (error) {
        handleWeatherError(error);
    }
}

function handleLocationError(error) {
    console.log(`Error getting location: ${error.message}`);
    // You can provide a user-friendly message or fallback behavior here
}

// Function to fetch weather based on latitude and longitude
async function fetchWeatherByCoordinates(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const apiKey = 'd7e52e98046df3ba1be2ce6ff1a2d0e8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }

        const data = await response.json();
        handleWeatherData(data);
    } catch (error) {
        handleWeatherError(error);
    }
}

async function fetchWeatherByCoordinates(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const apiKey = 'd7e52e98046df3ba1be2ce6ff1a2d0e8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }

        const data = await response.json();
        handleWeatherData(data);
    } catch (error) {
        handleWeatherError(error);
    }
}


// Function to ask for location and fetch weather on page load
function askForLocationAndFetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherByCoordinates, handleLocationError, { timeout: 5000 });
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Provide a user-friendly message or fallback behavior here
    }
}

// Trigger location fetching on page load
window.addEventListener('load', askForLocationAndFetchWeather);
document.getElementById('search-button').addEventListener('click', handleSearchButtonClick);

function handleSearchButtonClick() {
    const cityName = document.getElementById('search-input').value.trim();

    if (cityName !== '') {
        if (!hasLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    savedCoordinates = position.coords;
                    hasLocation = true;
                    fetchWeatherByCoordinates(position);
                },
                (error) => {
                    // Handle geolocation error or user denied permission
                    console.log("Error getting location:", error.message);
                    // You can provide a user-friendly message or fallback behavior here
                },
                { timeout: 5000 }
            );
        } else {
            // Use the saved coordinates for subsequent searches
            fetchWeather(cityName);
            addPastSearch(cityName);
        }
    } else {
        console.log("Please enter a city name.");
        // Provide user-friendly validation or feedback here
    }
}

// Attach an event listener to the button to trigger location fetching
document.getElementById('search-button').addEventListener('click', getCurrentLocation);

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherByCoordinates, handleLocationError, { timeout: 5000 });
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Provide a user-friendly message or fallback behavior here
    }
}

function handleWeatherData(data) {
    const cityName = data.city.name;
    document.getElementById('city-name').innerText = cityName;

    // Display current weather
    const temperatureKelvin = data.list[0].main.temp;
    const temperatureFahrenheit = convertKelvinToFahrenheit(temperatureKelvin);
    document.getElementById('temperature').innerText = `Temperature: ${temperatureFahrenheit.toFixed(2)} °F`;

    const description = data.list[0].weather[0].description;
    document.getElementById('description').innerText = `Description: ${description}`;

    const weatherIconCode = data.list[0].weather[0].icon;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = weatherIconUrl;

    const weekForecastList = document.getElementById('week-forecast');
    weekForecastList.innerHTML = '';

    const today = new Date();
    const next5Days = new Set();

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);

        if (date > today && !next5Days.has(formatDate(date))) {
            next5Days.add(formatDate(date));

            const listItem = document.createElement('li');
            const temperatureF = convertKelvinToFahrenheit(item.main.temp);
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            listItem.innerHTML = `
                <strong>${formatDate(date)}</strong><br>
                <img src="${iconUrl}" alt="${item.weather[0].description}"><br>
                Temperature: ${temperatureF.toFixed(2)} °F<br>
                Wind: ${item.wind.speed} m/s<br>
                Humidity: ${item.main.humidity}%
            `;
            weekForecastList.appendChild(listItem);

            if (next5Days.size === 5) {
                return;
            }
        }
    });
}

function convertKelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}

function handleWeatherError(error) {
    console.log('Error fetching weather data:', error.message);
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const defaultCityName = 'New York';

const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];

updatePastSearchList();

fetchWeather(defaultCityName);

document.getElementById('search-button').addEventListener('click', function () {
    const cityName = document.getElementById('search-input').value.trim();

    if (cityName !== '') {
        fetchWeather(cityName);
        addPastSearch(cityName);
    }
});

function updatePastSearchList() {
    const pastSearchList = document.getElementById('past-search-list');
    pastSearchList.innerHTML = '';

    pastSearches.slice(0, 5).forEach(search => {
        const listItem = document.createElement('li');
        listItem.textContent = search;
        listItem.addEventListener('click', () => {
            fetchWeather(search);
        });
        pastSearchList.appendChild(listItem);
    });
}

function addPastSearch(cityName) {
    pastSearches.unshift(cityName);

    localStorage.setItem('pastSearches', JSON.stringify(pastSearches));
    updatePastSearchList();
}

// Attach an event listener to the button to trigger location fetching
document.getElementById('search-button').addEventListener('click', getCurrentLocation);

