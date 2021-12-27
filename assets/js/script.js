function getWeatherInfo(x, y, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    x +
    "&lon=" +
    y +
    "&units=imperial&appid=648c5d45e53cd2b401e2b5f578752208";

  var cityName;
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
