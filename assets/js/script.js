function getCoordinates(city) {
  var apiUrl =
    // "https://api.openweathermap.org/data/2.5/weather?q=" +
    // city +
    // "&appid=648c5d45e53cd2b401e2b5f578752208";//
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
