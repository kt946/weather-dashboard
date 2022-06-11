// unique api key
var apiKey = "&appid=64c2d8fc8d96271e3ba05c28616d91c9";
var searchHistory = [];

// function to display current city weather conditions from data
var setWeatherDisplay = function(data) {
    var currentData = data.current;

    // set icon for weather condition
    $("#current-condition").attr("src", "https://openweathermap.org/img/wn/" + currentData.weather[0].icon + ".png");

    // set conditions
    $("#current-temp span").text(currentData.temp + "°F");

    $("#current-wind span").text(currentData.wind_speed + " MPH");

    $("#current-humidity span").text(currentData.humidity + " %");

    var currentUv = currentData.uvi;
    var uvIndex = $("#current-uv span");
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

// get searched city's latitude and longitude fron weather api
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

                    // pass city name to save history function
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

// function to display history to weather dashboard
var displayHistory = function(city) {
    $("#search-history").append(
        '<li class="searched-city rounded">' + city + '</li>'
    );
};

// function to load history from local storage
var loadHistory = function() {
    // get search history from local storage
    searchHistory = JSON.parse(localStorage.getItem("Search History"));

    //if nothing in local storage, create new array
    if (!searchHistory) {
        searchHistory = [];
    }

    console.log(searchHistory);

    // create search history list from array
    for (var i = 0; i < searchHistory.length; i++) {
        savedCity = searchHistory[i];
        displayHistory(savedCity);
    }
}

// function to save history
var saveHistory = function(city){
    // if no history exists, add first list item
    if (searchHistory === undefined || searchHistory.length === 0) {
        searchHistory.push(city);
        displayHistory(city);
        console.log("First Item In Search History");
    }
    else {
        // if search history does not have city already, add to list
        if (!searchHistory.includes(city)) {
            console.log("No Duplicate Found. Adding to Search History.");
            searchHistory.push(city);
            displayHistory(city);
        } else {
            console.log("City Already Exists in Search History");
        }
    }

    console.log(searchHistory);

    // save array to local storage
    localStorage.setItem("Search History", JSON.stringify(searchHistory));
};

// when search history item is clicked, get that city's weather
$("#search-history").on("click", "li", function(event ) {
    event.preventDefault();

    searchHistoryItem = $(this).text();
    getCityLocation(searchHistoryItem);
});

// when search button is clicked, get search term
$("#search-button").on("click", function() {
    //console.log("Search Button Clicked!");
    // set variable to search input value
    var searchTerm = $("#search-input").val();
    //console.log(searchTerm);

    // if input is not blank, pass search term to function to get city's location
    if (searchTerm) {
        getCityLocation(searchTerm);
    }

    // clear search input
    $("#search-input").val("");
});

// load search history from local storage first
loadHistory();