var weatherContainerEl = document.querySelector("#weatherContainer");
var cityFormEl = document.querySelector("#city-form");
var citySearchEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#today");
var fiveDayWeatherEl = document.querySelector("#five-day");
var pastSearchesEl = document.querySelector("#pastSearches");

function getFiveDayWeatherInfo(data) {
  // i=0 would be today, which is already displayed. So we loop through array items 1-5 to get the next 5 days
  fiveDayWeatherEl.textContent = "";
  for (i = 1; i <= 5; i++) {
    var dateCard = document.createElement("div");
    dateCard.classList.add("card");

    var futureDate = document.createElement("h4");
    var statusIcon =
      "http://openweathermap.org/img/wn/" +
      data.daily[i].weather[0].icon +
      "@2x.png";
    futureDate.innerHTML =
      moment().add(i, "d").format("l") + `<img src="${statusIcon}"/>`;
    dateCard.appendChild(futureDate);

    var futureTemp = document.createElement("li");
    futureTemp.innerHTML = "Temp: " + data.daily[i].temp.day + "&#8457";
    dateCard.appendChild(futureTemp);

    var futureWind = document.createElement("li");
    futureWind.innerHTML = "Wind: " + data.daily[i].wind_speed + "MPH";
    dateCard.appendChild(futureWind);

    var futureHumidity = document.createElement("li");
    futureHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
    dateCard.appendChild(futureHumidity);

    fiveDayWeatherEl.appendChild(dateCard);
  }
}

function displayCurrentWeather(city, status, temp, wind, humid, uv) {
  // if no result
  currentWeatherEl.textContent = "";
  var statusIcon = "http://openweathermap.org/img/wn/" + status + "@2x.png";
  var date = moment().format("l");

  var cityName = document.createElement("h2");
  cityName.innerHTML = city + " " + date + `<img src="${statusIcon}"/>`;
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
  //weatherContainerEl.appendChild(currentWeatherEl);

  // currentWeatherEl.
}

function getWeatherInfo(x, y, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    x +
    "&lon=" +
    y +
    "&units=imperial&appid=648c5d45e53cd2b401e2b5f578752208";

  var weatherStatus;
  var temperature;
  var windSpeed;
  var humidity;
  var uvIndex;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        weatherStatus = data.current.weather[0].icon;
        temperature = data.current.temp;
        windSpeed = data.current.wind_speed;
        humidity = data.current.humidity;
        uvIndex = data.current.uvi;
        console.log(data, weatherStatus);
        displayCurrentWeather(
          city,
          weatherStatus,
          temperature,
          windSpeed,
          humidity,
          uvIndex
        );
        getFiveDayWeatherInfo(data);
      });
    }
  });
}

function buildPastSearchButtons(cityname) {
  JSON.parse(window.localStorage.getItem(cityname));

  var searchButton = document.createElement("button");
  searchButton.innerHTML = cityname;
  pastSearchesEl.appendChild(searchButton);
}

function saveSearch(cityname, data) {
  localStorage.setItem(cityname, JSON.stringify(data));
  buildPastSearchButtons(cityname);
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
          console.log(typeof cityName);
          xCoord = data[0].lat;
          yCoord = data[0].lon;
          cityName = data[0].name;
          console.log(cityName, xCoord, yCoord);
          saveSearch(cityName, data);
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

function formSubmitHandler(event) {
  event.preventDefault();
  var city = citySearchEl.value.trim();

  if (city) {
    getCoordinates(city);
    citySearchEl.value = "";
  } else {
    alert("Please enter a valid city name");
  }
}

//getCoordinates("torrington");

cityFormEl.addEventListener("submit", formSubmitHandler);
