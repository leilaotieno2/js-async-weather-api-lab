// define variables to reference DOM elements
const form = document.querySelector('#city-form');
const cityInput = document.querySelector('#city');
const currentWeatherTable = document.querySelector('#current-weather');
const fiveDayForecast = document.querySelector('#five-day-forecast');
const weatherChart = document.querySelector('#weather-chart');

// add event listener to the form
form.addEventListener('submit', e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return; // if input is empty, do nothing

  // make current weather API call
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b41116ae0c173fdfe846b1cb957e4529`)
    .then(response => response.json())
    .then(data => {
      // populate table with weather information
      const {name, main, wind, weather} = data;
      currentWeatherTable.innerHTML = `
        <tr><td>City:</td><td>${name}</td></tr>
        <tr><td>Temperature:</td><td>${(main.temp - 273.15).toFixed(1)}°C</td></tr>
        <tr><td>Humidity:</td><td>${main.humidity}%</td></tr>
        <tr><td>Wind Speed:</td><td>${wind.speed} m/s</td></tr>
        <tr><td>Conditions:</td><td>${weather[0].description}</td></tr>
      `;
    })
    .catch(error => console.error(error));

  // make 5-day forecast API call
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=b41116ae0c173fdfe846b1cb957e4529`)
    .then(response => response.json())
    .then(data => {
      // create divs for each 3-hour forecast and append to aside element
      const forecasts = data.list;
      fiveDayForecast.innerHTML = '';
      forecasts.forEach(forecast => {
        const {dt_txt, main} = forecast;
        const div = document.createElement('div');
        div.innerHTML = `
          <p>${dt_txt}</p>
          <p>Temperature: ${(main.temp - 273.15).toFixed(1)}°C</p>
          <p>Humidity: ${main.humidity}%</p>
        `;
        fiveDayForecast.appendChild(div);
      });

      // create chart using Chart.js library
      const chartLabels = forecasts.map(forecast => forecast.dt_txt);
      const chartData = forecasts.map(forecast => (forecast.main.temp - 273.15).toFixed(1));
      const chartConfig = {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Temperature (°C)',
            data: chartData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {}
      };
      new Chart(weatherChart, chartConfig);
    })
    .catch(error => console.error(error));
});
