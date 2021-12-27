function getWeatherInfo(city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=648c5d45e53cd2b401e2b5f578752208";
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data, city);
        });
      } else {
        alert("not found");
      }
    })
    .catch(function (error) {
      alert("error");
    });
}

getWeatherInfo("torrington");
