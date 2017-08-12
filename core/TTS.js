module.exports = function(text) {
  const Logger = require("./Logger.js");
  const logger = new Logger("Jarvis");
  const googleTTS = require('google-tts-api');
  const fs = require("fs");
  const http = require('http');
  const https = require('https');
  const cmd = require('node-cmd');
  require('dotenv').config()


  if (process.env.TTS != undefined) {
    require('./'+process.env.TTS)(text);
    return;
  }


  // Make sure text is in a string format.
  text = text.toString();
  // Log it for debugging.
  logger.Info(text);
  // Call the googleTTS promise. 'en' is the language (english) and 1 is the speed.
  googleTTS(text, 'en', 1)
    // Url is the url returned by googleTTS. It is for downloading the speech.mp3 file.
    .then(function(url) {
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
    .catch(function(err) { // Handle errors.
      logger.Error(err.stack);
    });
}
