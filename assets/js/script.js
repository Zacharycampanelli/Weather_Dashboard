var currentWeatherEl = document.querySelector("#today");

function displayCurrentWeather(city, temp, wind, humid, uv) {
  // if no result

  //currentWeatherEl.textContent = "";
  var cityName = document.createElement("h2");
  cityName.innerHTML = city;
  currentWeatherEl.appendChild(cityName);

  var temperature = document.createElement("li");
  temperature.innerHTML = "Temp: " + temp + "&#8457";
  currentWeatherEl.appendChild(temperature);

  var windSpeed = document.createElement("li");
  windSpeed.innerHTML = "Wind: " + wind + "MPH";
  currentWeatherEl.appendChild(windSpeed);

  var humidity = document.createElement("li");
  humidity.innerHTML = "Humidity: " + humid + "%";
  currentWeatherEl.appendChild(humidity);

  var uvIndex = document.createElement("li");
  uvIndex.innerHTML = "UV Index: " + uv;
  currentWeatherEl.appendChild(uvIndex);

  // currentWeatherEl.
}

function getWeatherInfo(x, y, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    x +
    "&lon=" +
    y +
    "&units=imperial&appid=648c5d45e53cd2b401e2b5f578752208";

  var temperature;
  var windSpeed;
  var humidity;
  var uvIndex;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        temperature = data.current.temp;
        windSpeed = data.current.wind_speed;
        humidity = data.current.humidity;
        uvIndex = data.current.uvi;
        displayCurrentWeather(city, temperature, windSpeed, humidity, uvIndex);
      });
    }
  });
}

function getCoordinates(city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=648c5d45e53cd2b401e2b5f578752208";
  var xCoord;
  var yCoord;
  var cityName;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          xCoord = data[0].lat;
          yCoord = data[0].lon;
          cityName = data[0].name;
          console.log(cityName, xCoord, yCoord);
          getWeatherInfo(xCoord, yCoord, cityName);
        });
      } else {
        alert("not found");
      }
    })
    .catch(function (error) {
      alert("error");
    });
}

getCoordinates("torrington");
