require('dotenv').config()
const request = require('sync-request');
const chalk = require('chalk');
const {
    Wit,
    log
} = require('node-wit');
const client = new Wit({
    accessToken: process.env.witapi
});

String.prototype.replaceAll = function(target, replacement, append = "") {
  var ret = this.split(target).join(replacement);
  if(ret !== this.toString())
  {
    return ret+append;
  } else {
    return ret;
  }
};

var normalizedPath = require("path").join(__dirname, "/plugins");


let modules = {}

var logger = {
  Info: function(message)
  {
    if(this.name !== null && this.name !== undefined)
    {
      console.log("["+chalk.blue(this.name)+"] " + chalk.blue(message));
    } else {
      console.log("["+chalk.blue("Jarvis")+"] " + chalk.blue(message));
    }
  },

  Warning: function(message)
  {
    if(this.name !== null && this.name !== undefined)
    {
      console.log(chalk.bgYellow("["+chalk.blue(this.name)+"] " + chalk.blue.bold(message)));
    } else {
      console.log(chalk.bgYellow("["+chalk.blue("Jarvis")+"] " + chalk.blue.bold(message)));
    }
  },
  Error: function(message)
  {
    if(this.name !== null && this.name !== undefined)
    {
      console.log(chalk.bgRed("["+chalk.blue(this.name)+"] " + chalk.blue.bold.underline(message)));
    } else {
      console.log(chalk.bgRed("["+chalk.blue("Jarvis")+"] " + chalk.blue.bold.underline(message)));
    }
  },
  Debug: function(message)
  {
    if(this.name !== null && this.name !== undefined)
    {
      console.log(chalk.bgGreen("["+chalk.blue(this.name)+"] " + chalk.blue(message)));
    } else {
      console.log(chalk.bgGreen("["+chalk.blue("Jarvis")+"] " + chalk.blue(message)));
    }
  }
};

require("fs").readdirSync(normalizedPath).forEach(function(file) {

    modules[file.replace(".js", "")] = require("./plugins/" + file);
    var mod = modules[file.replace(".js", "")];
    if(mod.name !== null && mod.name !== undefined)
    {
      if(mod.version !== null && mod.version !== undefined)
      {
        logger.Info("Loaded " + mod.name + " module.");
        mod.Info = logger.Info;
        mod.Warning = logger.Warning;
        mod.Error = logger.Error;
        mod.Debug = logger.Debug;
        if (typeof mod.OnLoad === "function")
        {
          mod.OnLoad();
        }
      } else {
        logger.Error("Module " + file + " is missing a verion. Not loading module.");
        delete(modules[file.replace(".js", "")]);
      }
    } else {
      logger.Error("Module " + file + " is missing a name. Not loading module.");
      delete(modules[file.replace(".js", "")]);
    }
});

client.message('ten times ten', {})
    .then((data) => {
        logic(data);
    })
    .catch((err) => {
      logger.Error(err.message);
    });

let logic = function(input) {
    logger.Info(JSON.stringify(input));
    let logicModule = false;
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
              if(requirements[0][ii] !== "*") {
                if (requirements[0][ii] == inputSplits[i]) {
                    for (var iii in tags) {
                        for (var iiii in requirements[1]) {
                            if (tags[iii] == requirements[1][iiii]) {
                                metRequirement = true;
                            }
                        }
                    }

                }
              } else {
                for (var iii in tags) {
                    for (var iiii in requirements[1]) {
                        if (tags[iii] == requirements[1][iiii]) {
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
        TTS(logicModule.run(input, request))
    }
    else {
        TTS("Invalid Request");
    }
}

let TTS = function(text) {
    logger.Info(text)
}
