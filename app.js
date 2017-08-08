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
                    metRequirement = true;
                  }
                } else {
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
                  metRequirement = true;
                }
              } else {
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
var getLogic = function(logicModule, input, request)
{
  return new Promise(function (resolve, reject) {
    logicModule.run(input, request, resolve, reject);
  });
}

var TTS = function(text) {
  text = text.toString();
  logger.Info(text);
  googleTTS(text, 'en', 1)
  .then(function (url) {
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
  .catch(function (err) {
    logger.Error(err.stack);
  });
  /*commandExists('python3')
    .then(function(command) {
      cmd.get(`python3 ./speech.py "${text}"`,
        function(err, data, stderr) {
          if (!err) {
            if (process.env.os == "mac") {
              cmd.run('afplay speech.mp3')
            }
          } else {
            console.log('error', err)
          }

        });
    }).catch(function() {
      cmd.get(`python ./speech.py "${text}"`,
        function(err, data, stderr) {
          if (!err) {
            if (process.env.os == "mac") {
              cmd.run('afplay speech.mp3')
            }
          } else {
            console.log('error', err)
          }

        });
    });*/
}

app.get('/:request', function(req, res) {
  res.send("Pinged")
  client.message(unescape(req.param('request')), {})
    .then((data) => {
      logic(data);
    })
    .catch((err) => {
      logger.Error(err.message);
    });
})

ask();

app.listen(process.env.port, function() {
  logger.Info('Example app listening on port ' + process.env.port + '!')
})

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  if (fs.statSync(normalizedPath + "/" + file).isDirectory()) {

  } else {
    modules[file.replace(".js", "")] = require("./plugins/" + file);
    var mod = modules[file.replace(".js", "")];
    if (mod.name !== null && mod.name !== undefined) {
      if (mod.version !== null && mod.version !== undefined) {
        logger.Info("Loaded " + mod.name + " module.");

        if (typeof mod.TTS === "function") {
          TTS = mod.TTS;
          logger.Info("New TTS");
        }
        if (typeof mod.OnLoad === "function") {
          mod.OnLoad();
        } else {
          logger.Error("Module " + file + " is missing a verion. Not loading module.");
          delete(modules[file.replace(".js", "")]);
        }
      } else {
        logger.Error("Module " + file + " is missing a name. Not loading module.");
        delete(modules[file.replace(".js", "")]);
      }
    }
  }
});

if (process.env.Travis) {
  process.exit()
}
