const chalk = require('chalk');

/**
* The main class for all Logger functions.
* @alias module:core/Logger
* @module core/Logger
* @exports Logger
* @author HittmanA
* @example
* var logger = new Logger("Name");
* logger.Info("Hello World");
* @property {function} Info - Send information to the console.
* @property {function} Warning - Send a warning to the console.
* @property {function} Error - Send an error to the console.
* @property {function} Debug - Send a debug message to the console.
*/
class Logger {

  /**
  * @constructs
  * @param {string} name - The name to display in outputted console messages.
  */
  constructor(name) {
    this.name = name;
  }

  /**
  * This will output a nicely formatted console message prefixed with "[INFO][MODULE_NAME]" where module_name is the name of your module.
  * @function Info
  * @param {string} message - What you want to send to the console.
  * @example
  * Info("Hello World");
  */
  Info(message) {
    if (this.name !== null && this.name !== undefined) {
      console.log("[INFO][" + chalk.blue(this.name) + "] " + chalk.blue(message));
    } else {
      console.log("[INFO][" + chalk.blue("Jarvis") + "] " + chalk.blue(message));
    }
  }

  /**
  * This will output a nicely formatted warning message to the console prefixed with "[WARNING][MODULE_NAME]" where module_name is the name of your module.
  * @function Warning
  * @param {string} message - What you want to send to the console.
  * @example
  * Warning("We need more documentation!");
  */
  Warning(message) {
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgYellow("[WARNING][" + chalk.blue(this.name) + "] " + chalk.blue.bold(message)));
    } else {
      console.log(chalk.bgYellow("[WARNING][" + chalk.blue("Jarvis") + "] " + chalk.blue.bold(message)));
    }
  }

  /**
  * This will output a nicely formatted error message to the console prefixed with "[ERROR][MODULE_NAME]" where module_name is the name of your module.
  * @function Error
  * @param {string} message - What you want to send to the console.
  * @example
  * Error("Ship is sinking!");
  */
  Error(message) {
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgRed("[ERROR][" + chalk.blue(this.name) + "] " + chalk.blue.bold.underline(message)));
    } else {
      console.log(chalk.bgRed("[ERROR][" + chalk.blue("Jarvis") + "] " + chalk.blue.bold.underline(message)));
    }
  }

  /**
  * This will output a nicely formatted debug console message prefixed with "[DEBUG][MODULE_NAME]" where module_name is the name of your module.
  * @function Debug
  * @param {string} message - What you want to send to the console.
  * @example
  * Debug("We have a pest problem.");
  */
  Debug(message) {
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgGreen("[DEBUG][" + chalk.blue(this.name) + "] " + chalk.blue(message)));
    } else {
      console.log(chalk.bgGreen("[DEBUG][" + chalk.blue("Jarvis") + "] " + chalk.blue(message)));
    }
  }
}

module.exports = Logger;
