
var searchHistory = []
var lastCitySearched = ""

var getCityWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data);
                console.log(data);
            });
        } else {
            alert("Error: Weather Info Not Found")
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Open Weather")
        })
}

var searchSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = $("#cityname").val().trim();

    if (cityName) {
        getCityWeather(cityName);
        $("#cityname").val("");

    } else {
        alert("Please enter a city name");
    }
};

var displayWeather = function (weatherData) {

    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Tempature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=f4401833be8e217e5268c0b70c5108c4")
        .then(function (response) {
            response.json().then(function (data) {
                $("#uv-box").text(data.value);

                if (data.value >= 11) {
                    $("#uv-box").css("background-color", "#6c49cb")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "#d90011")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "#f95901")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "#f7e401")
                } else {
                    $("#uv-box").css("background-color", "#299501")
                }
            })
        });

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=f4401833be8e217e5268c0b70c5108c4&units=imperial")
        .then(function (response) {
            response.json().then(function (data) {
                $("#five-day").empty();

                for (i = 7; i <= data.list.length; i += 8) {

                    var fiveDayCard = `
                <div class="col-md-2 py-3 card text-white bg-primary">
                <div class="card-body p-1">
                    <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                    <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                    <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                    <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                </div>
            </div>
            `;

                    $("#five-day").append(fiveDayCard);
                }
            })
        })

        lastCitySearched = weatherData.name; 



        saveSearchHistory(weatherData.name); 


};

let saveSearchHistory = function (city) {
    if (!searchHistory.includes(city)){
        searchHistory.push(city); 
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    }

    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory)); 

    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched)); 

    loadSearchHistory(); 
}

let loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")); 
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched")); 

    if (!searchHistory) {
        searchHistory = []
    }

    if (!lastCitySearched) {
        lastCitySearched = ""
    }

    $("#search-history").empty(); 

    for (i = 0; i< searchHistory.length; i++) {
        $("search-History").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
};

loadSearchHistory(); 

if (lastCitySearched != "") {
    getCityWeather(lastCitySearched); 
}



$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function(event){
    let prevCity = $(event.target).closest("a").attr("id"); 
    getCityWeather(prevCity); 
}); 



// getCityWeather();


