module.exports = {
  requirements: "[set, alarm, remind, buzzer, alert] {datetime}",
  //plus, minus, times, divide, divided, multiply, add, subtract, +, -, *, x, /, sqrt, square, cube, cubed, squared, power, base, log, sin, sine, cos, cosine, tan, tangent
  name: "Alarm.js",
  version: "0.1.0",
  OnLoad: function() {
    this.Info(this.name + " " + this.version + " loaded! Sound the alarms!");
  },

  run: function(input, request) {
    var alarm = require('alarm');
    var response = "Sorry, I didn't get that.";

    var grabDate = input.entities.datetime[0].value;
    grabDate = grabDate.replaceAll("T", "-");
    grabDate = grabDate.split("-");
    console.log(grabDate);
    return response;
  }
}
