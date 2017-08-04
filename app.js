require('dotenv').config()
const request = require('sync-request');
const {
    Wit,
    log
} = require('node-wit');
const client = new Wit({
    accessToken: process.env.witapi
});

var normalizedPath = require("path").join(__dirname, "/plugins");


let modules = {}

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    modules[file.replace(".js", "")] = require("./plugins/" + file);
});

client.message('What will the temp be on friday', {})
    .then((data) => {
        logic(data);
    })

let logic = function(input) {
    console.log(JSON.stringify(input));
    let logicModule = false;
    let tags = []

    for (i in input.entities) {
        tags.push(i)
    }

    for (var mod in modules) {
        let metRequirement = false;
        let inputSplits = input._text.split(" ");
        let requirements = [modules[mod].requirements.match(/\[([^)]+)\]/)[1].split(", "), modules[mod].requirements.match(/\{([^)]+)\}/)[1].split(", ")]
        for (var i in inputSplits) {
            for (var ii in requirements[0]) {
                if (requirements[0][ii] == inputSplits[i]) {
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
    console.log(text)
}
