module.exports = {
    requirements: "",
    name: "trumpseak.js",
    version: "0.1.0",
    OnLoad: function() {
      this.Info(this.name + " " + this.version + " loaded!");

    },
    TTS: function(text, logger, cmd, process) {
        logger.Info(text)
        cmd.get(
        'curl "http://api.jungle.horse/speak?v=trump&vol=10&s='+escape(text)+'" -o speech.wav',
        function(err, data, stderr){
          if (!err) {
            console.log(process.env.os)
              if (process.env.os == "mac") {
                  cmd.run('afplay ./speech.wav')
              }
          } else {
              console.log('error', err)
          }
        }
    );
    }
}
