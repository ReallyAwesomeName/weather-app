// OpenWeather API key https://openweathermap.org/api
const openWeatherApiKey = "f06064b77c654c7cbd74422f1aaaf3c6";
// NOTE: example geo requests
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
// NOTE: example forecast requests
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ~~~~~~~~ SELECT ELEMENTS TO BE DISPLAYED AFTER SEARCH ~~~~~~~~
var $weatherToday = $("#weatherToday").hide();
// five day will contain 5 one days
var $weatherFiveDay = $("#weatherFiveDay").hide();
// recent searches list
var $searchesRecent = $("#searchesRecent").hide();

// ~~~~~~~~ SEARCH ~~~~~~~~
$("#searchBtn").click(function (e) {
  e.preventDefault();
  console.log("clicked");
  // const userQuery = $("#userQuery").val();
  // const coords = getCoordinates(userQuery);
  // DEBUG: get coords from user query
  testCoords = {
    lat: 40.7127,
    lon: -73.9872,
  };
  // ~~~~~~~~ GATHER RESULTS TO DISPLAY ~~~~~~~~
  // TODO: CONVERT TEMPERATURE
  getWeatherData(testCoords).then(function (data) {
    const weather = {
      temp: JSON.stringify(data.list[0].main.temp),
      weather: JSON.stringify(data.list[0].weather[0].main),
      wind: JSON.stringify(data.list[0].wind.speed),
      humidity: JSON.stringify(data.list[0].main.humidity),
      icon: JSON.stringify(data.list[0].weather[0].icon),
    };
    // ~~~~~~~~ DISPLAY RESULTS ~~~~~~~~
    // TODO: make this pretty - this is not putting it in list
    const weatherCardToday = buildCard(weather);
    $("#userPrompt").after(weatherCardToday);
    // $weatherToday
    //   .text(`${weather.temp}°C\n${weather.wind}mph\n${weather.humidity}%`)
    //   .show();
    // $weatherFiveDay.text(`TODO:PLACEHOLDER`).show();
    // $searchesRecent.text(`TODO:PLACEHOLDER`).show();
  });
});

// ~~~~~~~~ BUILD CARDS ~~~~~~~~
function buildCard(weatherData) {
  const weatherCardToday = `
  <div id="weatherToday" class="card col-5 mx-auto">
    <h5 class="card-header">Today:</h5>
    <div class="card-body">
      <ul class="list-group">
        <li class="list-group-item">Temperature: ${weatherData.temp}°</li>
        <li class="list-group-item">Weather: ${weatherData.weather}</li>
        <li class="list-group-item">Wind: ${weatherData.wind}</li>
        <li class="list-group-item">Humidity: ${weatherData.humidity}%</li>
        <li class="list-group-item">${weatherData.icon}</li>
      </ul>
    </div>
  </div>
  `;
  return weatherCardToday;
}

// ~~~~~~~~ API CALLS ~~~~~~~~
// get coordinates from user input - either zip code or city name
function getCoordinates(cityNameOrZip) {
  return new Promise(function (resolve, reject) {
    var zipcheck = /\d/g;
    if (zipcheck.test(cityNameOrZip)) {
      $.ajax({
        url: `http://api.openweathermap.org/geo/1.0/zip?appid=${openWeatherApiKey}&zip=${cityNameOrZip}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
          resolve(data);
        },
        error: function (err) {
          reject(err);
        },
      });
    } else {
      $.ajax({
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${cityNameOrZip}&limit=1&appid=${openWeatherApiKey}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
          resolve(data);
        },
        error: function (err) {
          reject(err);
        },
      });
    }
  });
}

// use coordinates to get weather data
function getWeatherData(coordinates) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherApiKey}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        resolve(data);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}

// ~~~~~~~~ DISPLAY RESULTS ~~~~~~~~
// $weatherToday.text("wow");

// testCoords = {
//   lat: 40.7127,
//   lon: -73.9872,
// };

// getWeatherData(testCoords).then(function (data) {
//   const result = JSON.stringify(data.list[0].main.temp);
//   $test.text(result);
// });
