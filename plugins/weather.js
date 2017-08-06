module.exports = {
    requirements: "[temperature, hot, cold, temp, weather, conditions] {datetime}",
    name: "Weather",
    version: "0.5.0",
    OnLoad: function() {
        this.Info(this.name + " " + this.version + " loaded!");
    },

    run: function(input, request) {
        var weekday = require('weekday');

        let response = "I'm sorry but our magic gods of weather can only get 5 days in the future";

        const grabDate = input.entities.datetime[0].value.substring(0, 10).split("-");
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const date1 = new Date(grabDate.join() + " 00:00:00");
        const date2 = new Date(`${yyyy}-${mm}-${dd} 00:00:00`);
        const diff = date1.getTime() - date2.getTime();
        const Days = diff / (1000 * 60 * 60) / 24;
        var day = (((Days - 1) * 8) + 4);
        if (Days == 0) {
            const weatherData = JSON.parse(request('GET', `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(process.env.owmlocation)}&appid=${process.env.owmapi}`).getBody('utf8'));
            let tempmin = weatherData.main.temp_min;
            let tempmax = weatherData.main.temp_max;
            let conditions = weatherData.weather[0].description;
            if(conditions = "clear sky") {
              conditions = conditions + "s";
            }
            let humidity = weatherData.main.humidity;
            let cloudCover = weatherData.clouds.all;

            var unit = "Kelvin";

            if (process.env.tempFormat == "f") {
                tempmin = Math.round(((tempmin - 273.15) * 1.8) + 32);
                tempmax = Math.round(((tempmax - 273.15) * 1.8) + 32);
                unit = "Fahrenheit";
            }

            if (process.env.tempFormat == "c") {
                tempmin = Math.round(tempmin - 273.15);
                tempmax = Math.round(tempmax - 273.15);
                unit = "Celsius";
            }

            response = `Today will have a high of ${tempmax}, a low of ${tempmin} degrees, and ${humidity}% humidity. Conditions will be ${conditions} with ${cloudCover}% cloud cover.`;
        }

        if (Days > 0 && Days < 6) {
            const weatherData = JSON.parse(request('GET', `http://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(process.env.owmlocation)}&appid=${process.env.owmapi}`).getBody('utf8'));
            let tempmin = weatherData.list[day].main.temp_min;
            this.Debug(JSON.stringify(weatherData.list[day].main));
            let tempmax = weatherData.list[day].main.temp_max;
            let conditions = weatherData.list[day].weather.description;
            if(conditions = "clear sky") {
              conditions = conditions + "s";
            }
            let humidity = weatherData.list[day].main.humidity;
            let cloudCover = weatherData.list[day].clouds.all;
            let days = "day";

            if (Days > 1) {
                days = "days";
            }

            var unit = "Kelvin";;

            if (process.env.tempFormat == "f") {
                tempmin = Math.round(((tempmin - 273.15) * 1.8) + 32);
                tempmax = Math.round(((tempmax - 273.15) * 1.8) + 32);
                var finaltemp = tempmin + tempmax;
                finaltemp = finaltemp/2;
                unit = "Fahrenheit";
            }

            if (process.env.tempFormat == "c") {
                tempmin = Math.round(tempmin - 273.15);
                tempmax = Math.round(tempmax - 273.15);
                var finaltemp = tempmin + tempmax;
                finaltemp = finaltemp/2;
                unit = "Celsius";
            }
            let today = weekday();
            let todayNumber = weekday(today);
            let theDay = weekday(todayNumber + 1 + Days);
            response = `On ${theDay} the high will be ${tempmax}, the low will be ${tempmin}, and the humidity will be ${humidity}%. Conditions will be ${conditions} with ${cloudCover}% cloud cover.`;
        }

        return response;
    }
}
