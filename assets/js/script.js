// OpenWeather API key https://openweathermap.org/api
const openWeatherApiKey = "f06064b77c654c7cbd74422f1aaaf3c6";
// NOTE: example geo requests
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
// NOTE: example forecast requests
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// Use the[5 Day Weather Forecast](https://openweathermap.org/forecast5)
// to retrieve weather data for cities.The base URL should look like the following:
// `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`

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
  // FIXME: get coords from user query
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
    const weatherCards = buildCards(data);
    $("#userPrompt").after(
      `<div class="row mx-5 my-4" id="weatherCardRow"></div>`
    );
    let theseCards = "";
    for ([key, value] of Object.entries(weatherCards)) {
      theseCards += value;
      // $("#userPrompt").after(`${value}`);
      // $weatherToday
      //   .text(`${weather.temp}°C\n${weather.wind}mph\n${weather.humidity}%`)
      //   .show();
      // $weatherFiveDay.text(`TODO:PLACEHOLDER`).show();
      // $searchesRecent.text(`TODO:PLACEHOLDER`).show();
    }
    $(`#weatherCardRow`).html(theseCards);
  });
});

// ~~~~~~~~ BUILD CARDS ~~~~~~~~
function buildCards(weatherData) {
  // FIXME: different times of same day instead of different days
  const weatherCards = {};
  for (let i = 0; i < 5; i++) {
    weatherCards[`weather_${i}`] = `
    <div id="weather_${i}" class="card col-4 mx-auto">
      <h5 class="card-header">${dayjs.unix(weatherData.list[i].dt)}</h5>
      <div class="card-body">
        <ul class="list-group">
          <li class="list-group-item">Temperature: ${
            weatherData.list[i].main.temp
          }°K</li>
          <li class="list-group-item">Condition: ${
            weatherData.list[i].weather[0].main
          }</li>
          <li class="list-group-item">Wind: ${
            weatherData.list[i].wind.speed
          }</li>
          <li class="list-group-item">Humidity: ${
            weatherData.list[i].main.humidity
          }%</li>
          <li class="list-group-item">${
            weatherData.list[i].weather[0].icon
          }</li>
        </ul>
      </div>
    </div>
    `;
  }
  return weatherCards;
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
