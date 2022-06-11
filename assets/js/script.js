// unique api key
var apiKey = "&appid=64c2d8fc8d96271e3ba05c28616d91c9";
var searchHistory = [];
var date = "";

// pass coordinates from 'getCityLocation()' into one call api
var getCityWeather = function(lat, lon) {
    // formate the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?&lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + apiKey;
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            //console.log(response);
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    //console.log(data);
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
                    console.log(data);
                    // get coordinates then pass into weather function
                    var y = data.coord.lat;
                    var x = data.coord.lon;
                    console.log(y);
                    console.log(x);
                    getCityWeather(y, x);

                    // set city display name to current city
                    $("#current-city").text(data.name);

                    // set date display to current date
                    date = data.dt;
                    var day = moment.unix(date).format("(D/M/YYYY)");
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

/*var getSearchTerm = function() {
    var searchTerm = $("#search-input").val();
};*/

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
})