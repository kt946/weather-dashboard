// unique api key
var apiKey = "&appid=64c2d8fc8d96271e3ba05c28616d91c9";
var searchHistory = [];

// function to display current city weather conditions from data
var setWeatherDisplay = function(data) {
    var currentData = data.current;

    // set icon for weather condition
    $("#current-condition").attr("src", "https://openweathermap.org/img/wn/" + currentData.weather[0].icon + ".png");

    // set conditions
    $("#current-temp").find("span").text(currentData.temp + "°F");

    $("#current-wind").find("span").text(currentData.wind_speed + " MPH");

    $("#current-humidity").find("span").text(currentData.humidity + " %");

    var currentUv = currentData.uvi;
    var uvIndex = $("#current-uv").find("span");
    uvIndex.text(currentUv);

    // remove uv index color classes
    uvIndex.removeClass("text-bg-success text-bg-warning text-bg-danger");

    // set uv index color classes
    if (currentUv < 3) {
        uvIndex.addClass("text-bg-success");
    } 
    else if (currentUv > 3 && currentUv < 8) {
        uvIndex.addClass("text-bg-warning");
    } 
    else if (currentUv > 8) {
        uvIndex.addClass("text-bg-danger");
    }
};

var setForcastDisplay = function(data) {
    // loop through each container in 5-day forecast
    for (var i = 0; i < 5; i++) {
        // set variable for each array in daily data
        var dailyData = data.daily[i+1];
        // select card by index
        var card = $(".day-container:eq(" + i + ")");

        // set date
        card.find("h3").text(moment.unix(dailyData.dt).format("(M/D/YYYY)"));

        // set icon for weather condition
        card.find("img").attr("src", "https://openweathermap.org/img/wn/" + dailyData.weather[0].icon + ".png");

        // set conditions
        card.find("#forecast-temp span").text(dailyData.temp.day + "°F");

        card.find("#forecast-wind span").text(dailyData.wind_speed + " MPH");

        card.find("#forecast-humidity span").text(dailyData.humidity + " %");
    }
};

// pass coordinates from 'getCityLocation()' into one call api
var getCityWeather = function(lat, lon) {
    // formate the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?&lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly" + apiKey;
    //console.log(apiUrl);
    
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
                    setForcastDisplay(data);
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

                    saveHistory(data.name);

                    // set date display to current date
                    var dateData = data.dt;
                    var date = moment.unix(dateData).format("(M/D/YYYY)");
                    //console.log(date);
                    $("#current-date").text(date);
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

var saveHistory = function(city){
    $("#search-history").append(
        '<li class="searched-city rounded">' + city + '</li>'
    );

    searchHistory.push(city);
    console.log(searchHistory);

    localStorage.setItem("city", JSON.stringify(searchHistory));
};

// When search button is clicked, retrieve search term
$("#search-button").on("click", function() {
    //console.log("Search Button Clicked!");
    // set variable to search input value
    var searchTerm = $("#search-input").val();
    //console.log(searchTerm);

    // if input is not blank, pass search term to function to get city's latitude and longitude
    if (searchTerm) {
        getCityLocation(searchTerm);
    }

    // clear search input
    $("#search-input").val("");
});