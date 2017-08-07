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

      var wtf_wikipedia = require("wtf_wikipedia");
      wtf_wikipedia.from_api(get, "en", function(markup){
        var obj= wtf_wikipedia.parse(markup);
        var intro = obj.sections[0].sentences;
        var ret = "";
        for(j in intro) {
          ret += intro[j].text;
        }
        resolve(ret);
      })
    }
}
