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
    const Logger = require("../core/Logger.js");
    const logger = new Logger(this.name);



    for (i in this.data){
      if (this.data[i].time ==  Math.round((new Date()).getTime() / 1000).toString()){
        logger.Info("Tick " + this.data[i].message)

      }

    }

  },

  run: function(input, request, resolve, reject) {

  }
}
