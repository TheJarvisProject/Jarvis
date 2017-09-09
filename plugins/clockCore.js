module.exports = {
  requirements: "[nevercalledlikethat] {nevercalledlikethat}",
  name: "clockCore.js",
  version: "0.1.0",
  data: ["hello"],
  OnLoad: function() {
    const Logger = require("../core/Logger.js");
    const logger = new Logger(this.name);

    logger.Info(this.name + " " + this.version + " loaded! Clock Core is setup");

    this.data = require("./clockCore/data.json")

    this.clock = setInterval(this.tick.bind(this), 1000);

  },

  tick: function() {
    const TTS = require("../core/TTS.js");
    const Logger = require("../core/Logger.js");
    const logger = new Logger(this.name);
    const date = new Date();
    // Time format is Year:Month:Weekday:Day:Hour:Minute:Second

    for (i in this.data) {
      const timeSplit = this.data[i].time.split(":")
      let check = [false, false, false, false, false, false, false];

      if (timeSplit[0] == "*") {
        check[0] = true
      } else if (timeSplit[0] == date.getFullYear()) {
        check[0] = true
      }

      if (timeSplit[1] == "*") {
        check[1] = true
      } else if (timeSplit[1] == date.getMonth() + 1) {
        check[1] = true
      }

      if (timeSplit[2] == "*") {
        check[2] = true
      } else if (timeSplit[2] == date.getDay() + 1) {
        check[2] = true
      }

      if (timeSplit[3] == "*") {
        check[3] = true
      } else if (timeSplit[3] == date.getDate()) {
        check[3] = true
      }

      if (timeSplit[4] == "*") {
        check[4] = true
      } else if (timeSplit[4] == date.getHours()) {
        check[4] = true
      }

      if (timeSplit[5] == "*") {
        check[5] = true
      } else if (timeSplit[5] == date.getMinutes()) {
        check[5] = true
      }

      if (timeSplit[6] == "*") {
        check[6] = true
      } else if (timeSplit[6] == date.getSeconds()) {
        check[6] = true
      }

      if (check[0]==true && check[1]==true && check[2]==true && check[3]==true && check[4]==true && check[5]==true && check[6]==true){
        TTS(this.data[i].message)
      }

    }

  },

  run: function() {
    this.data = require("./clockCore/data.json")
  }
}
