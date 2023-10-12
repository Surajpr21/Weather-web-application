document.addEventListener("DOMContentLoaded", function () {
    const app = document.querySelector('.weather-web');
    const temp = document.querySelector('.temp');
    const dateOutput = document.querySelector('.date');
    const timeOutput = document.querySelector('.time');
    const conditionOutput = document.querySelector('.condition');
    const nameOutput = document.querySelector('.name');
    const icon = document.querySelector('.icon');
    const cloudOutput = document.querySelector('.cloud');
    const humidityOutput = document.querySelector('.humidity');
    const windOutput = document.querySelector('.wind');
    const form = document.querySelector('#locationInput');
    const search = document.querySelector('.search');
    const cities = document.querySelectorAll('.city');
    
    let cityInput = "Bangalore";
    let backgroundClass = ''; 
    cities.forEach((city) => {
        city.addEventListener('click', (e) => {
            cityInput = e.target.textContent;
            fetchWeatherData();
            app.style.opacity = "0";
        });
    });
  
    form.addEventListener('submit', (e) => {
        if (search.value.length === 0) {
            alert('Please type in a city name');
        } else {
            cityInput = search.value;
            fetchWeatherData();
            search.value = "";
            app.style.opacity = "0";
        }
        e.preventDefault();
    });
  
    function fetchWeatherData() {
        const apiKey = '2a8afebb53ea174c94cd8e41e618e637';
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                temp.innerHTML = `${data.main.temp.toFixed(1)}&#176;C`;
                conditionOutput.innerHTML = data.weather[0].description;
    
                const timestamp = data.dt * 1000;
                const timezone = data.timezone;
    
                // Use the Intl.DateTimeFormat with a specific time zone
                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'UTC',
                };
                const formatter = new Intl.DateTimeFormat('en-US', options);
                const localDateObj = new Date(timestamp + timezone * 1000);
                const [dateFormatted, timeFormatted] = formatter.format(localDateObj).split(', ');
    
                dateOutput.innerHTML = dateFormatted;
                timeOutput.innerHTML = timeFormatted;
    
                nameOutput.innerHTML = data.name;
    
                const iconId = data.weather[0].icon;
                icon.src = `https://openweathermap.org/img/w/${iconId}.png`;
    
                cloudOutput.innerHTML = `${data.clouds.all || 0}%`;
                humidityOutput.innerHTML = `${data.main.humidity || 0}%`;
                windOutput.innerHTML = `${data.wind.speed || 0} km/h`;
    
                const code = data.weather[0].id;
                const timeOfDay = localDateObj.getHours() >= 6 && localDateObj.getHours() < 18 ? "day" : "night";
    
                setAppBackground(code, timeOfDay);
                app.style.opacity = "1";
            })
            .catch(error => {
                if (error.message === 'City not found') {
                    console.log('City not found, please enter a valid city name');
                } else {
                    console.error('An error occurred:', error);
                }
                app.style.opacity = "1";
            });
    }
    
  
    function setAppBackground(code, timeOfDay) {
        const backgroundElement = document.querySelector('.weather-web'); 
        if (backgroundElement) {
            if (code >= 200 && code < 600) {
                backgroundClass = 'rainy';
            } else if (code >= 600 && code < 700) {
                backgroundClass = 'snowy';
            } else if (code === 800) {
                backgroundClass = 'clear';
            } else if (code === 721) {
                backgroundClass = 'haze';
            } else if (code === 701 || code === 741) {
                backgroundClass = 'mist'; 
            } else if (code === 761 || code === 762) {
                backgroundClass = 'dusty'; 
            } else if (code > 800) {
                backgroundClass = 'cloudy';
            }
            backgroundElement.style.backgroundImage = `url('./assets/images/${timeOfDay}/${backgroundClass}.jpg')`;
        }
    }
  
    fetchWeatherData();
    app.style.opacity = "1";
});
