require('dotenv').config()
const request = require('sync-request');
const chalk = require('chalk');
const cmd = require('node-cmd');
const express = require('express');
const app = express();
const commandExists = require('command-exists');
const fs = require("fs");
const jsonStringify = require('json-pretty');

const {
    Wit,
    log
} = require('node-wit');
const client = new Wit({
    accessToken: process.env.witapi
});

String.prototype.replaceAll = function(target, replacement, append = "") {
    let ret = this.split(target).join(replacement);
    if (ret !== this.toString()) {
        return ret + append;
    } else {
        return ret;
    }
};

const normalizedPath = require("path").join(__dirname, "/plugins");

let modules = {};

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

const logger = {
    Info: function(message) {
        if (this.name !== null && this.name !== undefined) {
            console.log("[" + chalk.blue(this.name) + "] " + chalk.blue(message));
        } else {
            console.log("[" + chalk.blue("Jarvis") + "] " + chalk.blue(message));
        }
    },

    Warning: function(message) {
        if (this.name !== null && this.name !== undefined) {
            console.log(chalk.bgYellow("[" + chalk.blue(this.name) + "] " + chalk.blue.bold(message)));
            TTS(this.name + " says Warning, " + message);
        } else {
            console.log(chalk.bgYellow("[" + chalk.blue("Jarvis") + "] " + chalk.blue.bold(message)));
            TTS("Jarvis says Warning, " + message);
        }
    },
    Error: function(message) {
        if (this.name !== null && this.name !== undefined) {
            console.log(chalk.bgRed("[" + chalk.blue(this.name) + "] " + chalk.blue.bold.underline(message)));
            TTS(this.name + " says Error, " + message);
        } else {
            console.log(chalk.bgRed("[" + chalk.blue("Jarvis") + "] " + chalk.blue.bold.underline(message)));
            TTS("Jarvis says Error, " + message);
        }
    },
    Debug: function(message) {
        if (this.name !== null && this.name !== undefined) {
            console.log(chalk.bgGreen("[" + chalk.blue(this.name) + "] " + chalk.blue(message)));
        } else {
            console.log(chalk.bgGreen("[" + chalk.blue("Jarvis") + "] " + chalk.blue(message)));
        }
    }
};

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
        TTS(logicModule.run(input, request), logger, cmd, process)
    } else {
        TTS("I am sorrry, but I don't understand that.", logger, cmd, process);
    }
}

var TTS = function(text) {
    logger.Info(text)
    commandExists('python3')
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
        });
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
                mod.Info = logger.Info;
                mod.Warning = logger.Warning;
                mod.Error = logger.Error;
                mod.Debug = logger.Debug;
                mod.addConfig = Config.addConfig;
                mod.createConfig = Config.createConfig;
                mod.getDataFolder = Config.getDataFolder;
                mod.getConfigValue = Config.getConfigValue;

                if (typeof mod.TTS === "function") {
                    TTS = mod.TTS
                    logger.Info("New TTS")
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
