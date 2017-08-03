require('dotenv').config()
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


let logic = function(input) {
    console.log(JSON.stringify(input));
    var logicModule = false;
    for (var mod in modules) {
        let metRequirement = false;
        let inputSplits = input._text.split(" ");
        let requirements = [modules[mod].requirements.match(/\[([^)]+)\]/)[1].split(", ")]
        for (var i in inputSplits) {
            for (var ii in requirements[0]) {
                if (requirements[0][ii] == inputSplits[i]) {
                    metRequirement = true;
                }
            }
        }
        if (metRequirement) {
            logicModule = modules[mod];
            break;
        }
    }
    console.log(JSON.stringify(logicModule))
}

logic({
    _text: "What will the temp be tomorrow"
})
