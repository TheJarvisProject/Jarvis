module.exports = {
  requirements: "[variable] {math_expression}",
  name: "Variables",
  version: "0.1.0",
  globalVars: {},
  OnLoad: function() {
    const Logger = require("../core/Logger.js");
    const logger = new Logger(this.name);

    logger.Info(this.name + " " + this.version + " loaded!");
  },

  run: function(input, request, resolve, reject) {
    var response = input.__text;
    var variable = respone.split("equals");
    variable[0].replaceAll("variable ", "");
    globalVars[variable[0]] = variable[1];
    console.log(globalVars);
    resolve(response);
  }
}
