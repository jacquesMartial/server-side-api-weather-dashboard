var currentWeatherEl = document.querySelector(".currentWeather");
var fivedaysWeatherEl = document.querySelector("#fivedaysForecast");
var searchBtn = document.querySelector("#searchWeather");
var searchHistoryContainer = document.querySelector(".searchHistory");
getHistory();

function getcityWeather(event) {
  event.preventDefault();
  var cityInput = document.querySelector("#city").value;
  if (!cityInput) {
    console.error("Enter a valid city");
    return;
  }
  getCurrentWeather(cityInput);
  saveWeatherHistory(cityInput);
}

function saveWeatherHistory(city) {
  var storage = JSON.parse(localStorage.getItem("weatherHistory"));
  if (storage === null) {
    storage = [];
  }
  storage.push(city);
  localStorage.setItem("weatherHistory", JSON.stringify(storage));
  getHistory();
}

function getHistory() {
  var storage = JSON.parse(localStorage.getItem("weatherHistory"));
  if (storage === null) {
    searchHistoryContainer.textContent = "No Recent Searches";
  } else {
    searchHistoryContainer.textContent = "";
    for (var i = 0; i < storage.length; i++) {
      var historyBtn = document.createElement("button");
      historyBtn.textContent = storage[i];
      searchHistoryContainer.append(historyBtn);

      historyBtn.addEventListener("click", function (event) {
        event.preventDefault();
        getCurrentWeather(event.target.textContent);
      });
    }
  }
}

function getCurrentWeather(city) {
  var firstReqEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=52a4998c1c4fd8fe4efa1319ba5392fb`;

  fetch(firstReqEndpoint)
    .then((res) => res.json())
    .then((currentData) => {
      console.log(currentData);

      // current weather data
      var cityName = document.querySelector(".city-name");
      cityName.textContent = currentData.name;

      // currentTemp
      var currentTemp = document.getElementById("currentTemp");
      var lat = currentData.coord.lat;
      var lon = currentData.coord.lon;
      currentTemp.textContent = "Temp:" + currentData.main.temp + "F";

      //wind data
      var windEl = document.querySelector(".wind");
      windEl.textContent = "Wind:" + currentData.wind.speed + "MPH";

      //current humidity
      var currentHumidity = document.querySelector(".currentHumidity");
      currentHumidity.textContent =
        "Humidity:" + currentData.main.humidity + "%";

      getFiveDay(lat, lon);
    });
}

function getFiveDay(lat, lon) {
  fivedaysWeatherEl.textContent = "";
  var secondReqEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&units=imperial&lon=${lon}&appid=52a4998c1c4fd8fe4efa1319ba5392fb`;

  fetch(secondReqEndpoint)
    .then((res) => res.json())
    .then((fiveDayData) => {
      console.log(fiveDayData);

      // five weather day data - create a for loop to loop through fiveDayData.list
      for (var i = 0; i < 5; i++) {
        var fiveDayCard = document.createElement("div");
        fiveDayCard.setAttribute("class", "five-day-card");
        fivedaysWeatherEl.append(fiveDayCard);

        var fiveDayTemp = document.createElement("h3");
        fiveDayTemp.textContent =
          "Temp: " + fiveDayData.list[i].main.temp + " F";
        fiveDayCard.append(fiveDayTemp);

        var fiveDayWind = document.createElement("h3");
        fiveDayWind.textContent =
          "Wind: " + fiveDayData.list[i].wind.speed + "MPH";
        fiveDayCard.append(fiveDayWind);

        var fiveDayHumidity = document.createElement("h3");
        fiveDayHumidity.textContent =
          "Humidity: " + fiveDayData.list[i].main.humidity + "%";
        fiveDayCard.append(fiveDayHumidity);
      }
    });
}

searchBtn.addEventListener("click", getcityWeather);
