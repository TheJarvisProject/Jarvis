module.exports = {
    requirements: "[wikipedia, wiki] {intent}",
    name: "WikipediaSearch.js",
    version: "0.1.0",
    OnLoad: function() {
      const logger = require("../core/Logger.js");
      logger.registerLogger(this.name);
      logger.Info(this.name + " " + this.version + " loaded!");
    },

    run: function(input, request, resolve, reject) {
      var get = input._text;
      get = get.replace(/wikipedia/i,"");
      get = get.replace(/wiki/i,"");
      get =get.replace(/search/i,"");
      get = get.replace(/for/,"");

      const wiki = require('wikijs').default;
      wiki().page(get)
      .then(page => page.summary())
      .then(resolve);
    }
}
