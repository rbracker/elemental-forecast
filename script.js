function fetchWeather(cityName) {
    const apiKey = 'd7e52e98046df3ba1be2ce6ff1a2d0e8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }
            return response.json();
        })
        .then(data => handleWeatherData(data))
        .catch(error => handleWeatherError(error));
}

function handleWeatherData(data) {
    if (data) {
        updateWeatherElements(data);
    } else {
        console.error('Unexpected data format in the API response');
    }
}

function updateWeatherElements(data) {
    document.getElementById('city-name').innerText = data.city.name;

    // Display current weather
    const temperatureFahrenheit = convertKelvinToFahrenheit(data.list[0].main.temp);
    document.getElementById('temperature').innerText = `Temperature: ${temperatureFahrenheit.toFixed(2)} °F`;
    document.getElementById('description').innerText = `Description: ${data.list[0].weather[0].description}`;

    // Display 5-day forecast
    const weekForecastList = document.getElementById('week-forecast');
    weekForecastList.innerHTML = ''; // Clear previous content

    const today = new Date(); // Get the current date
    const next5Days = new Set(); // Use a Set to avoid duplicates if the API data contains multiple readings for the same day

    for (let i = 0; i < data.list.length; i += 1) {
        const date = new Date(data.list[i].dt * 1000);
        
        // Check if the date is in the future and not already added
        if (date > today && !next5Days.has(formatDate(date))) {
            next5Days.add(formatDate(date));

            const listItem = document.createElement('li');
            const temperatureF = convertKelvinToFahrenheit(data.list[i].main.temp);
            listItem.innerHTML = `
                <strong>${formatDate(date)}</strong><br>
                Temperature: ${temperatureF.toFixed(2)} °F<br>
                Wind: ${data.list[i].wind.speed} m/s<br>
                Humidity: ${data.list[i].main.humidity}%
            `;
            weekForecastList.appendChild(listItem);

            if (next5Days.size === 5) {
                break; // Stop when 5 unique future dates are found
            }
        }
    }
}

function convertKelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}

function handleWeatherError(error) {
    console.log('Error fetching weather data:', error.message);
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Your existing code...

// Example city name (replace with your desired city name)
const defaultCityName = 'London';

// Load past searches from local storage or initialize an empty array
const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];

// Fetch weather data using the default city name
fetchWeather(defaultCityName);

// Add an event listener for the search button
document.getElementById('search-button').addEventListener('click', function () {
    const cityName = document.getElementById('search-input').value.trim();

    if (cityName !== '') {
        // Fetch weather data using the provided city name
        fetchWeather(cityName);
        // Add the current search to the past searches list
        addPastSearch(cityName);
    }
});

// Add this function to update the list of past searches in the UI
function updatePastSearchList() {
    const pastSearchList = document.getElementById('past-search-list');
    pastSearchList.innerHTML = '';

    pastSearches.slice(0, 5).forEach(search => {
        const listItem = document.createElement('li');
        listItem.textContent = search;
        listItem.addEventListener('click', () => {
            // Clicking on a past search re-fetches the weather for that city
            fetchWeather(search);
        });
        pastSearchList.appendChild(listItem);
    });
}

// Add this function to add a new search to the past searches list
function addPastSearch(cityName) {
    // Add the new search to the beginning of the array
    pastSearches.unshift(cityName);

    // Save the updated past searches list to local storage
    localStorage.setItem('pastSearches', JSON.stringify(pastSearches));

    // Update the UI to reflect the changes
    updatePastSearchList();
}

