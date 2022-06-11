// unique api key
var apiKey = "&appid=64c2d8fc8d96271e3ba05c28616d91c9";
var searchHistory = [];

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
                    console.log(data);
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
                    console.log(y);
                    console.log(x);
                    getCityWeather(y, x);
                })
            } else {
                alert("Error: City does not exist");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

var searchTerm = "London";

getCityLocation(searchTerm);