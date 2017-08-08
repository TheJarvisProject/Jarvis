// Requirements
require('dotenv').config()
const request = require('sync-request');
const chalk = require('chalk');
const cmd = require('node-cmd');
const express = require('express');
const app = express();
const commandExists = require('command-exists');
const fs = require("fs");
const jsonStringify = require('json-pretty');
const readline = require('readline');
const Logger = require("./core/Logger.js");
const logger = new Logger("Jarvis");
const googleTTS = require('google-tts-api');
const http = require('http');
const https = require('https');
// End Requirements

//Setup a readline interface for the ask function
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * The ask function is used for debugging. It will have Jarvis parse anything you type in the console.
 * @example
 * ask();
 */
var ask = function() {
  rl.question('> ', (answer) => {
    client.message(unescape(answer), {})
      .then((data) => {
        logic(data);
      })
      .catch((err) => {
        logger.Error(err.message);
      });
  });
}

// Require Wit.ai stuff
const {
  Wit,
  log
} = require('node-wit');

// Set our access token to what we have in the .env file.
const client = new Wit({
  accessToken: process.env.witapi
});

/**
 * Replaces all instances of specified string with a replacment. If you add a third param it will also append that string to the end of whatever it replaces.
 * @class String
 * @function replaceAll
 * @param {string} target - The string you want to replace.
 * @param {string} replacment - What to replace the target string with.
 * @param {string} [append] - what to append after the string that was replaced. Default value is nothing.
 * @returns {string} Returns the modified string;
 */
String.prototype.replaceAll = function(target, replacement, append = "") {
  let ret = this.split(target).join(replacement);
  if (ret !== this.toString()) {
    return ret + append;
  } else {
    return ret;
  }
};

// Set a global path to use for plugins.
const normalizedPath = require("path").join(__dirname, "/plugins");

let modules = {};

/**
 * @todo Move this to its own file.
 * @class Config
 * @deprecated Until further notice.
 */
var Config = {
  getDataFolder: function() {
    return "./plugins/" + this.name + "/";
  },

  createConfig: function() {
    if (fs.existsSync(this.getDataFolder())) {
      return;
    } else {
      fs.mkdirSync(this.getDataFolder());
    }
  },

  addConfig: function(name, def) {
    if (fs.existsSync(this.getDataFolder() + name + ".json")) {
      return;
    } else {
      var fd = fs.openSync(this.getDataFolder() + this.name + ".json", 'w');
      if (def === null && def === undefined) {
        def = {};
      }
      fs.writeFile(this.getDataFolder() + this.name + ".json", jsonStringify(def), function(err) {
        if (err) {
          return console.log(err);
        }

        return;
      });
    }
  },

  getConfigValue: function(name) {
    if (fs.existsSync(this.getDataFolder() + this.name + ".json")) {
      var file = require(this.getDataFolder() + this.name + ".json");
      return file[name];
    } else {
      return;
    }
  }
}

/**
 * Oh boy this is gonna be fun. logic is the core Jarvis function. It runs all the necessary checks before calling a specific module. This requires {@link module:core/Logger}.
 * @function logic
 * @param {string} input - What you want Jarvis to parse.
 * @requires module:core/Logger
 * @example
 * logic("weather today"); // Jarvis will call the weather module for this and return the weather conditions for today.
 */
let logic = function(input) {
  // Output whatever input is in a JSON format.
  logger.Info(JSON.stringify(input));
  // Default to false.
  let logicModule = false;
  // Initialize an array.
  let tags = []

  for (i in input.entities) {
    tags.push(i)
  }

  for (var mod in modules) {
    let metRequirement = false;
    let inputSplits = input._text.split(" ");
    let requirements = [modules[mod].requirements.match(/\[([^)]+)\]/)[1].split(", "), modules[mod].requirements.match(/\{([^)]+)\}/)[1].split(", ")];
    for (var i in inputSplits) {
      for (var ii in requirements[0]) {
        if (requirements[0][ii] !== "*") {
          if (requirements[0][ii] == inputSplits[i]) {
            for (var iii in tags) {
              for (var iiii in requirements[1]) {
                if (tags[iii] !== "*") {
                  if (tags[iii] == requirements[1][iiii]) {
                    // If the tag requirements and the word requirements are meet
                    metRequirement = true;
                  }
                } else {
                  // Wildcard
                  metRequirement = true;
                }
              }
            }
          }
        } else {
          for (var iii in tags) {
            for (var iiii in requirements[1]) {
              if (tags[iii] !== "*") {
                if (tags[iii] == requirements[1][iiii]) {
                  // If wildcard word and requirements are meet
                  metRequirement = true;
                }
              } else {
                // Wildcard
                metRequirement = true;
              }
            }
          }
        }
      }
    }
    if (metRequirement) {
      logicModule = modules[mod];
      break;
    }
  }

  if (logicModule != false) {
    getLogic(logicModule, input, request).then(data => TTS(data, logger, cmd, process));
    ask();
  } else {
    TTS("I am sorrry, but I don't understand that.", logger, cmd, process);
    ask();
  }
}

/**
 * The function that actually runs a module's `run` function. THIS IS FOR INTERNAL USE ONLY! USE THE {@link logic} FUNCTION INSTEAD!
 * @private
 * @function getLogic
 * @param {Object} logicModule - The export from the module. Each module is `require()`ed therefore this accepts an object.
 * @param {string} input - The input string from {@link logic}. This is passed to the module for processing.
 * @param {Object} request - The sync-request module.
 * @returns {Promise} This is a new promise. The module will either reject or resolve the promise. This allows the module to decide when to return a value.
 */
var getLogic = function(logicModule, input, request) {
  return new Promise(function(resolve, reject) {
    logicModule.run(input, request, resolve, reject);
  });
}

/**
* This function will convert text in speech (Text To Speech).
* @function TTS
* @param {string} text - The text to convert into a string.
* @requires module:core/Logger
*/
var TTS = function(text) {
  // Make sure text is in a string format.
  text = text.toString();
  // Log it for debugging.
  logger.Info(text);
  // Call the googleTTS promise. 'en' is the language (english) and 1 is the speed.
  googleTTS(text, 'en', 1)
<<<<<<< HEAD
  // Url is the url returned by googleTTS. It is for downloading the speech.mp3 file.
  .then(function (url) {
    // Open a new write stream to speech.mp3.
    var file = fs.createWriteStream("./speech.mp3");
    // Download the mp3 file.
    var request = https.get(url, function(response) {
      // Pipe the file response to speech.mp3.
      response.pipe(file);
      // Close the write stream once we are done.
      file.on('finish', function() {
        file.close();
      });
      // If we are on a mac.
      if (process.env.os == "mac") {
        // Play the speech file.
        cmd.run('afplay speech.mp3')
      }
    }).on('error', function(err) { // Handle errors.
      logger.Error(err.stack);
    });
  })
  .catch(function (err) { // Handle errors.
    logger.Error(err.stack);
  });
=======
    .then(function(url) {
      var file = fs.createWriteStream("./speech.mp3");
      var request = https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
        });
        if (process.env.os == "mac") {
          cmd.run('afplay speech.mp3')
        }
      }).on('error', function(err) { // Handle errors
        logger.Error(err);
      });
    })
    .catch(function(err) {
      logger.Error(err.stack);
    });
>>>>>>> herohamp/master
}

// Local webserver for listen.py (I WANT IT GONE SO BAD!).
app.get('/:request', function(req, res) {
  res.send("Pinged")
  // Send input to Wit.ai
  client.message(unescape(req.param('request')), {})
    .then((data) => {
      // Send what we get from Wit to the logic function.
      logic(data);
    })
    .catch((err) => { // Handle errors.
      logger.Error(err.stack);
    });
})

// First ask
ask();

// Start the webserver.
app.listen(process.env.port, function() {
  logger.Info('Example app listening on port ' + process.env.port + '!')
})

// Module Loading. Get the name of all files and folders in the normalizedPath.
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  // If file variable is a folder, do nothing.
  if (fs.statSync(normalizedPath + "/" + file).isDirectory()) {

  } else {
    // Add the module to the modules array.
    modules[file.replace(".js", "")] = require("./plugins/" + file);
    // Helper variable to make subsequent stuff easier. Its just a reference to the mod we are currently loading.
    var mod = modules[file.replace(".js", "")];
    // If this mod doesn't have a name, error out.
    if (mod.name !== null && mod.name !== undefined) {
      // If this mod doesn't have a version, error out.
      if (mod.version !== null && mod.version !== undefined) {
        logger.Info("Loaded " + mod.name + " module.");

        // If this mod has a TTS function, set our current TTS function to it.
        if (typeof mod.TTS === "function") {
          TTS = mod.TTS;
          logger.Info("New TTS");
        }
        // If this mod has an OnLoad function, call it.
        if (typeof mod.OnLoad === "function") {
          mod.OnLoad();
        }
      } else {
        logger.Error("Module " + file + " is missing a verion. Not loading module.");
        // Remove mod from modules array.
        delete(modules[file.replace(".js", "")]);
      }
    } else {
      logger.Error("Module " + file + " is missing a name. Not loading module.");
      // Remove mod from modules array.
      delete(modules[file.replace(".js", "")]);
    }
  }
});

// If this is Travis, stop.
if (process.env.Travis) {
  process.exit()
}
