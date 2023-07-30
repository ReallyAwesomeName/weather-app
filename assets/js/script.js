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
  // const userQuery = $("input[name=userQuery]").val();
  // console.log(userQuery);
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
    const weatherCards = buildCards(data);
    $("#userPrompt").after(
      `<div class="row mx-5 my-4" id="weatherCardRow"></div>`
    );
    let theseCards = "";
    for ([key, value] of Object.entries(weatherCards)) {
      theseCards += value;
    }
    $(`#weatherCardRow`).html(theseCards);
  });
});

// ~~~~~~~~ BUILD CARDS ~~~~~~~~
function buildCards(weatherData) {
  const weatherCards = {};
  const nowDt = dayjs().add(1, "day").startOf("day").unix();
  const endDt = dayjs().add(6, "day").startOf("day").unix();
  for (let i = 0; i < weatherData.list.length; i++) {
    var thisItem = weatherData.list[i];
    if (!prevItem) {
      if (weatherData.list[i - 1]) {
        var prevItem = weatherData.list[i - 1];
      }
    }
    if (prevItem) {
      // breakpoint is for when one day has passed
      let breakpoint = prevItem.dt;
      let thisTime = thisItem.dt;
      if (thisTime >= breakpoint) {
        // adding card, update prevItem to thisItem
        prevItem = thisItem;
        if (thisItem.dt_txt.slice(11, 13) === "12") {
          const thisDate = dayjs(thisItem.dt_txt).format("dddd, MMMM D");

          weatherCards[`weather_${i}`] = `
    <div id="weather_${i}" class="card col-4 mx-auto">
      <h5 class="card-header">${thisDate}</h5>
      <div class="card-body">
        <ul class="list-group">
          <li class="list-group-item">Temperature: ${(
            weatherData.list[i].main.temp - 273.15
          ).toFixed(2)}°C</li>
          <li class="list-group-item">Condition: ${
            weatherData.list[i].weather[0].main
          }</li>
          <li class="list-group-item">Wind: ${
            weatherData.list[i].wind.speed
          } m/s</li>
          <li class="list-group-item">Humidity: ${
            weatherData.list[i].main.humidity
          }%</li>
          <li class="list-group-item"><img src='https://openweathermap.org/img/w/${
            weatherData.list[i].weather[0].icon
          }.png'></li>
        </ul>
      </div>
    </div>
    `;
        }
      }
    }
  }
  return weatherCards;
}

// ~~~~~~~~ API CALLS ~~~~~~~~
// get coordinates from user input - either zip code or city name
// function getCoordinates(userQuery) {
//   const zipCheck = /^\d{5}$/;
//   if (zipCheck.test(userQuery)) {
//     fetch(
//       `http://api.openweathermap.org/geo/1.0/zip?appid=${openWeatherApiKey}&zip=${userQuery}`
//     )
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         const coords = { lat: data.lat, lon: data.lon };
//         return coords;
//       });
//   } else {
//     fetch(
//       `http://api.openweathermap.org/geo/1.0/direct?q=${userQuery}&limit=5&appid=${openWeatherApiKey}`
//     ).then(function (response) {
//       return response.json();
//     });
//   }
// }

// FIXME: COORDINATES UNDEFINED
// function getWeatherData(userQuery) {
//   // get coordinates from user input - either zip code or city name
//   const zipCheck = /^\d{5}$/;
//   if (zipCheck.test(userQuery)) {
//     fetch(
//       `http://api.openweathermap.org/geo/1.0/zip?appid=${openWeatherApiKey}&zip=${userQuery}`
//     )
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         const coordinates = { lat: data.lat, lon: data.lon };

//         // use those coordinates to get weather data
//         fetch(
//           `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${openWeatherApiKey}`
//         )
//           .then(function (response) {
//             return response.json();
//           })
//           .then(function (data) {
//             return data;
//           });
//       });
//   } else {
//     fetch(
//       `http://api.openweathermap.org/geo/1.0/direct?q=${userQuery}&limit=5&appid=${openWeatherApiKey}`
//     )
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         const coordinates = { lat: data.lat, lon: data.lon };

//         // use those coordinates to get weather data
//         fetch(
//           `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${openWeatherApiKey}`
//         )
//           .then(function (response) {
//             return response.json();
//           })
//           .then(function (data) {
//             return data;
//           });
//       });
//   }
// }

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
