$(document).ready(function() {
    $("#search").on("click", function(){
        event.preventDefault();

        // Here we grab the text from the input box
        var city = $("#city").val();
        searchWeather(city);
        fiveDayForecast(city);
    });
    

    $(".history").on("click", "li", function(){
        // console.log($(this).text());
        searchWeather($(this).text());
        fiveDayForecast($(this).text());
    });

    function makeRow(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li);
    };

    function searchWeather(city) {
        
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=acf348ebcd0d43c83beaf5c573f26468",
            method: "GET",
        }).then(function(response) {
            if (history.indexOf(city) === -1) {
                history.push(city);
                window.localStorage.setItem("history", JSON.stringify(history));
                makeRow(city);
                
            }
            
            // console.log(response)
                
            $("#today").empty();

            var title = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toDateString() + ")" );
            var card = $("<div>").addClass("card");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + " F");
            var cardBody = $("<div>").addClass("card-body");

            var iconCode = response.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var img = $("<img>").attr('src', iconUrl);

            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);

            
            getUVIndex(response.coord.lat, response.coord.lon);
    
            
        });
    };


    function fiveDayForecast(city) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=acf348ebcd0d43c83beaf5c573f26468",
            method: "GET",
        }).then(function(data){
            // console.log(data);
            // add jquery to append html for 5 day forecast
            $("#forecast").html("<h4 class=\"mt3\">5-Day Forecast:</h4>");
            // data.list.each(function() 
            for (i = 0; i < data.list.length; i += 8){
                // console.log(data.list[i])
            var forecastCard = $("<div>").addClass("card");

            var forecastTitle = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toDateString());
            var forecastIconCode = data.list[i].weather[0].icon;
            var forecastIconUrl = "http://openweathermap.org/img/w/" + forecastIconCode + ".png";
            var forecastImg = $("<img>").attr('src', forecastIconUrl);

            
            var forecastTemp = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp.toFixed() + " °F");
            var forecastHumid = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var forecastCardBody = $("<div>").addClass("card-body forecast");

            

            forecastCardBody.append(forecastTitle, forecastImg, forecastTemp, forecastHumid);
            forecastCard.append(forecastCardBody);
            $("#forecast").append(forecastCard);
            }
        })
    };
    
    

    function getUVIndex(lat, lon) {
        console.log(lat, lon);
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=acf348ebcd0d43c83beaf5c573f26468&lat=" + lat + "&lon=" + lon,
            method: "GET",
        }).then(function(data) {
            console.log(data);
            var uv = $("<p>").text("UV Index: ");
            var btn = $("<span>").addClass("btn btn-sm").text(data.value);

            if (data.value < 3) {
                btn.addClass("btn-success");
            }
            else if (data.value < 7) {
                btn.addClass("btn-warning");
            }
            else {
                btn.addClass("btn-danger");
            }

            uv.append(btn);
            $("#today .card-body").append(uv);
        })
    };

    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length - 1]);
    }

    for (i = 0; i < history.length; i++) {
        makeRow(history[i]);
    }

    

    
});
