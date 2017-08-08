/**
* The main class for all Logger functions.
* @class Logger
* @param {string} name - The name to display in outputted  console messages.
* @author HittmanA
* @example
* var logger = new Logger("Name");
* logger.Info("Hello World");
* @property {function} registerLogger - The function to register your module with the logger.
* @property {function} Info - Send information to the console.
* @property {function} Warning - Send a warning to the console.
* @property {function} Error - Send an error to the console.
* @property {function} Debug - Send a debug message to the console.
*/
class Logger {

  constructor(name) {
    this.name = name;
  }

  /**
  * This will output a nicely formatted console message prefixed with "[MODULE_NAME]" where module_name is the name of your module.
  * @function Info
  * @example
  * Info("Hello World");
  */
  Info(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log("[" + chalk.blue(this.name) + "] " + chalk.blue(message));
    } else {
      console.log("[" + chalk.blue("Jarvis") + "] " + chalk.blue(message));
    }
  }

  Warning(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgYellow("[" + chalk.blue(this.name) + "] " + chalk.blue.bold(message)));
    } else {
      console.log(chalk.bgYellow("[" + chalk.blue("Jarvis") + "] " + chalk.blue.bold(message)));
    }
  }

  Error(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgRed("[" + chalk.blue(this.name) + "] " + chalk.blue.bold.underline(message)));
    } else {
      console.log(chalk.bgRed("[" + chalk.blue("Jarvis") + "] " + chalk.blue.bold.underline(message)));
    }
  }

  Debug(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgGreen("[" + chalk.blue(this.name) + "] " + chalk.blue(message)));
    } else {
      console.log(chalk.bgGreen("[" + chalk.blue("Jarvis") + "] " + chalk.blue(message)));
    }
  }
}

module.exports = Logger;
