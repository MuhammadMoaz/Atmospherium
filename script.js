function getWeather() {
    // Declaring const variables for OpenWeatherMap API Key and user input
    const apiKey = '57ec634104e21d1591dc55b26b64a016';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    alert(currentWeatherUrl);
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Making the hidden weather information hidden
    weatherWrapperDiv = document.getElementById('weather-wrapper-div');
    weatherWrapperDiv.style.visibility = 'hidden';

    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
    })
    .catch(error => {
        console.error('Error fetching current weather data:'. error);
        alert('Error fetching current weather data. Please try again.');
    });

    fetch(forecastUrl)   
    .then(response => response.json())
    .then(forecastData => {
        displayForecast(forecastData.list);
    })
    .catch(error => {
        console.error('Error fetching hourly forecast data:'. error);
        alert('Error fetching hourly forecast data. Please try again.');
    });
}

function displayWeather(data) {
    // Getting information elements to update with new information
    const currentWeatherDiv = document.getElementById('current-weather');
    const weatherMetaList = document.getElementById('meta-list');
    const feelsLikeDiv = document.getElementById('feels-like-stat');
    const windSpeedDiv = document.getElementById('wind-speed-stat');
    const visibilityDiv = document.getElementById('visibility-stat');
    const humidityDiv = document.getElementById('humidity-stat');
    const sunriseDiv = document.getElementById('sunrise-stat');
    const sunsetDiv = document.getElementById('sunset-stat');
    const psiDiv = document.getElementById('psi-stat');

    // Clear previous content
    currentWeatherDiv.innerHTML = '';
    weatherMetaList.innerHTML = '';
    feelsLikeDiv.innerHTML = '';
    windSpeedDiv.innerHTML = '';
    visibilityDiv.innerHTML = '';
    humidityDiv.innerHTML = '';
    psiDiv.innerHTML = '';
    sunriseDiv.innerHTML = '';
    sunsetDiv.innerHTML = '';

    if (data.cod == '404') {
        alert(data.message);
         
    }
    else {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };

        // Storing relevant data from API call as variables  
        // Highlight box
        const cityName = data.name;
        const countryName = data.sys.country;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        const fullDate = new Date(data.dt*1000);
        const date = fullDate.toLocaleDateString("en-US", options);
        const time = data.dt - data.timezone;
        
        // Statistics box
        const feelsLike = Math.round(data.main.feels_like);
        const windSpeed = Math.round(data.wind.speed);
        const visibility = (data.visibility / 1000).toFixed(1);
        const humidity = data.main.humidity;
        const psi = data.main.pressure;

        const sunriseTime = data.sys.sunrise - data.timezone;
        const sunsetTime = data.sys.sunset - data.timezone;

        // Creating new HTML to be inserted into webpage
        const temperatureHTML = `<p class="temp-text">${temperature}&deg</p>`;
        const iconHTML = `<img id='weather-icon' class="weather-icon" width=128 height=128 src="${iconUrl}" alt="${description}">`
        
        const cityCountryHTML = `<li class="location-text"><span class="fa-li"><i class="fa-solid fa-location-dot"></i></span>${cityName + ', ' + countryName}</li>`;
        const dateHTML = `<li class="date-text"><span class="fa-li"><i class="fa-regular fa-calendar"></i></span>${date}</li>`;
        const timeHTML = `<li class="time-text"><span class="fa-li"><i class="fa-regular fa-clock"></i></span>${moment.unix(time).format('HH:mm a')}</li>`;

        const feelsLikeHTML = `<p>Feels Like</p> <p>${feelsLike}&degC</p>`;
        const windSpeedHTML = `<p>Wind Speed</p> <p>${windSpeed}m/s</p>`;
        const visibilityHTML = `<p>Visibility</p> <p>${visibility}km</p>`;
        const humidityHTML = `<p>Humidity</p> <p>${humidity}%</p>`;
        const psiHTML = `<p>Pressure</p> <p>${psi}hPa</p>`;
        const sunriseHTML = `<p>Sunrise</p> <p>${moment.unix(sunriseTime).format('HH:mm a')}</p>`;
        const sunsetHTML = `<p>Sunset</p> <p>${moment.unix(sunsetTime).format('HH:mm a')}</p>`;

        // Updating elements to show current weather data
        // Highlight box
        currentWeatherDiv.innerHTML += temperatureHTML;
        currentWeatherDiv.innerHTML += iconHTML;
        weatherMetaList.innerHTML += cityCountryHTML;
        weatherMetaList.innerHTML += dateHTML;
        weatherMetaList.innerHTML += timeHTML;
        
        // Statistics box
        feelsLikeDiv.innerHTML += feelsLikeHTML;
        windSpeedDiv.innerHTML += windSpeedHTML;
        visibilityDiv.innerHTML += visibilityHTML;
        humidityDiv.innerHTML += humidityHTML;
        psiDiv.innerHTML += psiHTML;
        sunriseDiv.innerHTML += sunriseHTML;
        sunsetDiv.innerHTML += sunsetHTML;

        showImage();
    }
}

function displayForecast(forecastData) {
    // Getting div elements to update with new information
    const hourlyForecastDiv = document.getElementById('hourly-forecast-div');
    const hourlyWindForecastDiv = document.getElementById('hourly-wind-forecast-div');
    const next24Hours = forecastData.slice(0, 8);

    const weekForecastDiv = document.getElementById('week-forecast-div');
    const dayArray = forecastData.slice(6);
    const next5Days = [dayArray[0], dayArray[8], dayArray[16], dayArray[24], dayArray[32]];

    // Clearing previous content
    hourlyForecastDiv.innerHTML = '';
    hourlyWindForecastDiv.innerHTML = '';
    weekForecastDiv.innerHTML = `<h2 class="week-forecast-title">This Week</h2>`;

    next24Hours.forEach(item => {
        // Storing relevant data from API call as variables
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const windSpeed = Math.round(item.wind.speed);
        const windDeg = item.wind.deg - 45;

        // Creating new HTML to be inserted into webpage
        const hourlyItemHTML = `
        <div class="hourly-item">

            <p class="day-forecast-time-label">${hour}:00</p>
            <img src="${iconURL}" alt="" width="96" height="96">
            <p class="day-forecast-temp-label">${temperature}&deg</p>
    
        </div>
        `;

        const windItemHTML = `
        <div class="wind-item">
        
            <i class="fa-solid fa-location-arrow fa-3x fa-rotate-by" style="--fa-rotate-angle: ${windDeg}deg;"></i>
            <p class="wind-forecast-speed">${windSpeed}m/s</p>

        </div>
        `;

        // Updating elements to show current weather data
        hourlyForecastDiv.innerHTML += hourlyItemHTML;
        hourlyWindForecastDiv.innerHTML += windItemHTML;
    })

    next5Days.forEach(item => {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        // Storing relevant data from API call as variables
        const dateTime = new Date(item.dt_txt);
        weekDayIndex = dateTime.getDay();
        weekDay = dayNames[weekDayIndex];
        weekDate = dateTime.getDate();
        weekMonth = dateTime.toLocaleString('default', {month: 'short'});
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Creating new HTML to be inserted into webpage
        const weekForecastItemHTML = `
        <div class="week-forecast-item">

            <img src="${iconURL}" alt="" width="64" height="64">
            <p class="week-forecast-temp-label">${temperature}&deg</p>
            <p class="week-forecast-date-label">${weekDate} ${weekMonth}</p>
            <p class="week-forecast-day-label">${weekDay}</p>

        </div>
        `

        // Updating elements to show current weather data
        weekForecastDiv.innerHTML += weekForecastItemHTML;
    })

    // Making the hidden weather information visible
    weatherWrapperDiv = document.getElementById('weather-wrapper-div');
    weatherWrapperDiv.style.visibility = 'visible';
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}