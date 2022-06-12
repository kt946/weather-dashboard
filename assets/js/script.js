// unique api key
var apiKey = "&appid=b179b0ec8a494dd3814af7d275d79d75";
var searchHistory = [];
var currentCity = "";
var currentDate = "";

// function to display current city weather
var setWeatherDisplay = function(data) {
    var currentData = data.current;
    // empty display of current values
    $("#city-display").empty();

    // set up display
    $("#city-display").append(
        "<div class='d-flex align-items-center gap-2'>"+
        "<h2 id='current-city' class='fw-bold fs-1'></h2>"+
        "<h2 id='current-date' class='fw-bold fs-1'></h2>"+
        "<img id='current-condition' src=''/></div>"+
        "<p id='current-temp'>Temp: <span></span></p>"+
        "<p id='current-wind'>Wind: <span></span></p>"+
        "<p id='current-humidity'>Humidity: <span></span></p>"+
        "<p id='current-uv'>UV Index: <span class='rounded p-1 px-3'></span></p>"
    );

    // set city display name to current city
    $("#current-city").text(currentCity);

    // set date display to current date
    $("#current-date").text(currentDate);

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
    uvIndex.removeClass("text-bg-low text-bg-moderate text-bg-high text-bg-very-high text-bg-extreme");

    // set uv index color classes
    if (currentUv < 3) {
        uvIndex.addClass("text-bg-low");
    } 
    else if (currentUv > 3 && currentUv < 6) {
        uvIndex.addClass("text-bg-moderate");
    }
    else if (currentUv > 6 && currentUv < 8) {
        uvIndex.addClass("text-bg-high");
    }  
    else if (currentUv > 8 && currentUv < 11) {
        uvIndex.addClass("text-bg-very-high");
    }
    else if (currentUv > 11) {
        uvIndex.addClass("text-bg-extreme");
    }
};

// function to display current city's 5-day forecast
var setForcastDisplay = function(data) {
    // empty cards of current values
    $(".day-container").empty();
    
    // create cards
    $(".day-container").append(
        "<h3 class='card-title'>Day 1</h3>"+
        "<img class='src=''>"+
        "<p id='forecast-temp'>Temp: <span></span></p>"+
        "<p id='forecast-wind'>Wind: <span></span></p>"+
        "<p id='forecast-humidity'>Humidity: <span></span></p>"
    );

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

// function to get city's weather from  one call api
var getCityWeather = function(lat, lon) {
    // formate the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?&lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly" + apiKey;
    
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    // pass data to display functions
                    setWeatherDisplay(data);
                    setForcastDisplay(data);
                })
            }
        })
};

// function to get searched city's latitude and longitude fron weather api
var getCityLocation = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    // set up global variables for later use
                    currentCity = data.name;
                    var dateData = data.dt;
                    currentDate = moment.unix(dateData).format("(M/D/YYYY)");

                    // get coordinates then pass into weather function
                    var y = data.coord.lat;
                    var x = data.coord.lon;
                    getCityWeather(y, x);
                    
                    // pass city name to save history function
                    saveHistory(data.name);
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
        '<li class="searched-city btn text-light">' + city + '</li>'
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
    }
    else {
        // if search history does not have city already, add to list
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            displayHistory(city);
        }
    }

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
    // set variable to search input value
    var searchTerm = $("#search-input").val();

    // if input is not blank, pass search term to function to get city's location
    if (searchTerm) {
        getCityLocation(searchTerm);
    }

    // clear search input
    $("#search-input").val("");
});

// when delete button is clicked, delete history from storage, display, and array
$("#delete-button").on("click", function() {
    localStorage.removeItem("Search History");
    $("#search-history").empty();
    searchHistory = [];
});

// load search history from local storage first
loadHistory();