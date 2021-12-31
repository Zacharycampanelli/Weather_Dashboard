var weatherContainerEl = document.querySelector("#weatherContainer");
var cityFormEl = document.querySelector("#city-form");
var citySearchEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#today");
var fiveDayWeatherEl = document.querySelector("#five-day");
var pastSearchesEl = document.querySelector("#pastSearches");


// Displays the following five days of weather
function getFiveDayWeatherInfo(data) {
  // i=0 would be today, which is already displayed. So we loop through array items 1-5 to get the next 5 days
  fiveDayWeatherEl.textContent = "";

  var fiveDayText = document.querySelector("#fiveDayHeader");
  fiveDayText.innerHTML = "5-Day Forecast:";

  var fiveDayContainer = document.createElement("div");
  fiveDayContainer.classList.add("d-flex", "flex-row" , "justify-content-between")

  
  for (i = 1; i <= 5; i++) {
    var dateCard = document.createElement("div");
    dateCard.setAttribute("id", "fiveDayCard")
    dateCard.classList.add("card");

    var futureDate = document.createElement("h4");
    var statusIcon =
      "http://openweathermap.org/img/wn/" +
      data.daily[i].weather[0].icon +
      "@2x.png";
    futureDate.innerHTML =
      moment().add(i, "d").format("l") + "<br />" + `<img src="${statusIcon}" style="width:2.5em;height:2.5em;" />`;
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

    

    fiveDayContainer.appendChild(dateCard)
    fiveDayWeatherEl.appendChild(fiveDayContainer);
  }
}

// Gets the uv index and changes the background color based on its severity
function getUvIndexColor(item, uv) {
  if (uv <= 2) {
    item.setAttribute("id", "low");
  } else if (3 <= uv <= 5) {
    item.setAttribute("id", "moderate");
  } else if (6 <= uv <= 7) {
    item.setAttribute("id", "high");
  } else if (8 <= uv <= 10) {
    item.setAttribute("id", "very-high");
  } else if (uv >= 11) {
    item.setAttribute("id", "extreme");
  }
}

// Displays weather information for the current day
function displayCurrentWeather(city, status, temp, wind, humid, uv) {
  currentWeatherEl.textContent = "";
  var statusIcon = "http://openweathermap.org/img/wn/" + status + "@2x.png";
  var date = moment().format("l");

  var cityName = document.createElement("h3");
  cityName.innerHTML =
    city +
    " (" +
    date +
    ") " +
    `<img src="${statusIcon}" style="width:2.5em;height:2.5em;"/>`;
  cityName.classList.add("weatherHeader");
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
  console.log(uv);
  uvIndex.innerHTML = "UV Index: ";
  var uvItem = document.createElement("span");
  uvItem.innerHTML = uv;
  getUvIndexColor(uvItem, uv);
  uvIndex.appendChild(uvItem);
  currentWeatherEl.appendChild(uvIndex);
}

// Takes the coordinates of the location and uses the OpenWeatherAPI to get weather information on that city
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

function buttonClickHandler(event) {
  var selectedCity = event.target.getAttribute("data-city");
  if (selectedCity) {
    var storageItem = JSON.parse(window.localStorage.getItem(selectedCity));
  }
  console.log(storageItem);
  getWeatherInfo(storageItem[0].lat, storageItem[0].lon, selectedCity);
}

// Saves a search as a button to allow user to quickly reaccess it
function buildPastSearchButtons(cityname) {
  JSON.parse(window.localStorage.getItem(cityname));

  var searchButton = document.createElement("button");
  searchButton.innerHTML = cityname;
  searchButton.setAttribute("data-city", cityname);
  searchButton.classList.add("previousSearch");
  pastSearchesEl.appendChild(searchButton);
}

function saveSearch(cityname, data) {
  localStorage.setItem(cityname, JSON.stringify(data));
  buildPastSearchButtons(cityname);
}

// Takes the user's search for a city namme and gets the coordinates
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


cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchesEl.addEventListener("click", buttonClickHandler);
