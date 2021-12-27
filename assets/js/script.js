function getWeatherInfo(x, y) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    x +
    "&lon=" +
    y +
    "&appid=648c5d45e53cd2b401e2b5f578752208";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
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
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          xCoord = data[0].lat;
          yCoord = data[0].lon;
          console.log(xCoord, yCoord);
          getWeatherInfo(xCoord, yCoord);
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
