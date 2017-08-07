module.exports = {
  requirements: "[youtube, play] {intent}",
  name: "YoutubePlay",
  version: "0.1.0",
  OnLoad: function() {
    const logger = require("../core/Logger.js");
    logger.registerLogger(this.name);
    logger.Info(this.name + " " + this.version + " loaded!");
    /*this.createConfig();
    this.addConfig("plugin", {
      key: "YOURKEY"
    });*/
  }

  /*run: function(input, request) {
    var search = require('youtube-search');

    var opts = {
      maxResults: 10,
      key: this.getConfigValue("key")
    };

    var val = input._text;
    val = val.replace(/play/i, "");
    val = val.replace(/youtube/i, "");

    search(val, opts, function(err, results) {
      if (err) return console.log(err);

      console.dir(results);
    });

    return val;
  }*/
}
