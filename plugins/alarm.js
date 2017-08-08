module.exports = {
  requirements: "[set, alarm, remind, buzzer, alert] {datetime}",
  name: "Alarm.js",
  version: "0.1.0",
  OnLoad: function() {
    const Logger = require("../core/Logger.js");
    const logger = new Logger(this.name);
    
    logger.Info(this.name + " " + this.version + " loaded! Sound the alarms!");
  },

  run: function(input, request, resolve, reject) {
    var alarm = require('alarm');
    var response = "Sorry, I didn't get that.";

    var grabDate = input.entities.datetime[0].value;
    /*grabDate = grabDate.replaceAll("T", "-");
    grabDate = grabDate.split("-");
    var time = grabDate[3].split(":");
    var date = {
      year: grabDate[0],
      month: grabDate[1],
      day: grabDate[2],
      hour: time[0],
      minute: time[1],
      second: time[2]
    }*/
    var theDate = new Date(grabDate);
    //console.log(date);
    console.log(theDate);
    resolve(response);
  }
}
