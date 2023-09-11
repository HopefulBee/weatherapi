const express = require("express");
const https = require("https");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

require("dotenv").config();

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
});
app.post("/", function (req,res) { 
    const query = req.body.cityName;
    const apiKey = process.env.weather_API_KEY;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" +apiKey;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + ".png"            
        // Just put res.set or res.setHeader with content type before res.write will give you the solution.

            res.set("Content-Type", "text/html");
            res.write("<h2>The temperature in "+ query +  "is " + temp + " degrees Celsius.</h2>");
            res.write ("<p> The weather can be described as " + desc +".</p>");
            res.write("<img src=" + imageURL + ">");
            res.send(); 
        });
    });
});
    
app.listen(3000, function() {
    console.log("Server is running");
});
