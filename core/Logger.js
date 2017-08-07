module.exports = {
  name: "",
  registerLogger: function(name) {
    this.name = "Jarvis";
  },

  Info: function(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log("[" + chalk.blue(this.name) + "] " + chalk.blue(message));
    } else {
      console.log("[" + chalk.blue("Jarvis") + "] " + chalk.blue(message));
    }
  },

  Warning: function(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgYellow("[" + chalk.blue(this.name) + "] " + chalk.blue.bold(message)));
    } else {
      console.log(chalk.bgYellow("[" + chalk.blue("Jarvis") + "] " + chalk.blue.bold(message)));
    }
  },
  Error: function(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgRed("[" + chalk.blue(this.name) + "] " + chalk.blue.bold.underline(message)));
    } else {
      console.log(chalk.bgRed("[" + chalk.blue("Jarvis") + "] " + chalk.blue.bold.underline(message)));
    }
  },
  Debug: function(message) {
    const chalk = require('chalk');
    if (this.name !== null && this.name !== undefined) {
      console.log(chalk.bgGreen("[" + chalk.blue(this.name) + "] " + chalk.blue(message)));
    } else {
      console.log(chalk.bgGreen("[" + chalk.blue("Jarvis") + "] " + chalk.blue(message)));
    }
  }
}
