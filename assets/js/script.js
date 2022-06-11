// unique api key
var apiKey = "&appid=64c2d8fc8d96271e3ba05c28616d91c9";
var searchHistory = [];
// variables for city latitude and longitude coordinates 
var lan = "";
var lon = "";

// first get searched city's lat and lon fron weather api
var getCityLocation = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            //console.log(response);
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    lan = data.coord.lat;
                    lon = data.coord.lon;
                    console.log(lan);
                    console.log(lon);
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

/*var getCity = function(city) {
    // formate the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?&appid=64c2d8fc8d96271e3ba05c28616d91c9";
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            console.log(response);
            // request successful
            if (response.ok) {
                response.json().then(function(data) {
                    //console.log(data);
                })
            } else {
                alert("Error: City does not exist");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};*/

getCityLocation(searchTerm);