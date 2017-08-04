module.exports = {
    requirements: "[temperature, hot, cold, temp] {datetime}",
    name: "Temperature",
    version: "0.2.0",
    OnLoad: function()
    {
      this.Info(this.name + " " + this.version + " loaded!");
    },

    run: function(input, request) {

        let response = "I'm sorry but our magic gods of weather can only get 5 days in the future"

        const grabDate = input.entities.datetime[0].value.substring(0, 10).split("-");
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const date1 = new Date(grabDate.join() + " 00:00:00");
        const date2 = new Date(`${yyyy}-${mm}-${dd} 00:00:00`);
        const diff = date1.getTime() - date2.getTime();
        const Days = diff / (1000 * 60 * 60) / 24;
        if (Days == 0) {
            const weatherData = JSON.parse(request('GET', `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(process.env.owmlocation)}&appid=${process.env.owmapi}`).getBody('utf8'));
            let temp = weatherData.main.temp

            if (process.env.tempFormat == "f") {
                temp = Math.round(((temp - 273.15) * 1.8) + 32)
            }

            if (process.env.tempFormat == "c") {
                temp = Math.round(temp - 273.15)
            }

            response = `Todays temperature in ${process.env.owmlocation} is ${temp} degrees`
        }

        if (Days > 0 && Days < 6) {
            const weatherData = JSON.parse(request('GET', `http://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(process.env.owmlocation)}&appid=${process.env.owmapi}`).getBody('utf8'));
            let temp = weatherData.list[(((Days - 1) * 8) + 4)].main.temp
            let days = "day"

            if (Days > 1) {
                days = "days"
            }

            if (process.env.tempFormat == "f") {
                temp = Math.round(((temp - 273.15) * 1.8) + 32)
            }

            if (process.env.tempFormat == "c") {
                temp = Math.round(temp - 273.15)
            }

            response = `The temperature in ${process.env.owmlocation} in ${Days} ${days} will be ${temp} degrees`
        }

        return response;
    }
}
