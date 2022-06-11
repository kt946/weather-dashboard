// unique api key
var apiKey = "&appid=64c2d8fc8d96271e3ba05c28616d91c9";
var searchHistory = [];
var date = "";

// function to display current city weather conditions from data
var setWeatherDisplay = function(data) {
    // set icon for weather condition
    var currentCondition = data.current.weather[0].icon;
    $("#current-condition").attr("src", "https://openweathermap.org/img/wn/" + currentCondition + ".png")

    // set conditions
    var currentTemp = data.current.temp;
    $("#current-temp").find("span").text(currentTemp + "°F");

    var currentWind = data.current.wind_speed;
    $("#current-wind").find("span").text(currentWind + " MPH");

    var currentHumidity = data.current.humidity;
    $("#current-humidity").find("span").text(currentHumidity + " %");

    var currentUv = data.current.uvi;
    var uvIndex = $("#current-uv").find("span");
    uvIndex.text(currentUv);

    // remove uv index color classes
    uvIndex.removeClass("text-bg-success text-bg-warning text-bg-danger");

    // set uv index color classes
    if (currentUv < 3) {
        uvIndex.addClass("text-bg-success");
    } 
    else if (currentUv > 3 && currentUv < 7) {
        uvIndex.addClass("text-bg-warning");
    } 
    else if (currentUv > 7) {
        uvIndex.addClass("text-bg-danger");
    }
};

// pass coordinates from 'getCityLocation()' into one call api
var getCityWeather = function(lat, lon) {
    // formate the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?&lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly" + apiKey;
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            //console.log(response);
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    //console.log(data);

                    // pass data to display functions
                    setWeatherDisplay(data);
                })
            }
        })
};

// first get searched city's latitude and longitude fron weather api
var getCityLocation = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            //console.log(response);
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    //console.log(data);

                    // get coordinates then pass into weather function
                    var y = data.coord.lat;
                    var x = data.coord.lon;
                    //console.log(y);
                    //console.log(x);
                    getCityWeather(y, x);

                    // set city display name to current city
                    $("#current-city").text(data.name);

                    // set date display to current date
                    date = data.dt;
                    var day = moment.unix(date).format("(M/D/YYYY)");
                    //console.log(day);
                    $("#current-date").text(day);
                })
            } else {
                // if user input a city that does not exist
                alert("Error: City does not exist");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

// When search button is clicked, retrieve search term
$("#search-button").on("click", function() {
    //console.log("Search Button Clicked!");
    // set variable to search input value
    var searchTerm = $("#search-input").val();
    console.log(searchTerm);

    // if input is not blank, pass search term to function to get city's latitude and longitude
    if (searchTerm) {
        getCityLocation(searchTerm);
    }

    // clear search input
    $("#search-input").val("");
});