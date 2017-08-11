module.exports = {
  requirements: "[plus, minus, times, divide, divided, multiply, add, subtract, +, -, *, x, /, sqrt, square, cube, cubed, squared, power, base, log, sin, sine, cos, cosine, tan, tangent] {math_expression}",
  name: "Math.js",
  version: "0.6.0",
  OnLoad: function() {
    const Logger = require("../core/Logger.js");
    const logger = new Logger(this.name);

    logger.Info(this.name + " " + this.version + " loaded!");
  },

  run: function(input, request, resolve, reject) {
    const math = require('mathjs');

    const Small = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90
    }

    const Magnitude = {
      thousand: 1000,
      million: 1000000,
      billion: 1000000000,
      trillion: 1000000000000,
      quadrillion: 1000000000000000,
      quintillion: 1000000000000000000,
      sextillion: 1000000000000000000000,
      septillion: 1000000000000000000000000,
      octillion: 1000000000000000000000000000,
      nonillion: 1000000000000000000000000000000,
      decillion: 1000000000000000000000000000000000
    }

    function word2num(wordnum) {
      const wordnumArray = wordnum.split(/[\s-]+/)
      let n = 0
      let g = 0

      for (const numPart of wordnumArray) {
        let small = Small[numPart]

        if (small) {
          g += small
        } else if (numPart === 'hundred' && g !== 0) {
          g *= 100
        } else {
          small = Magnitude[numPart]

          if (small) {
            n += g * small
            g = 0
          } else {
            return numPart;
          }
        }
      }

      return n + g
    }

    module.exports = word2num;

    let response = "Sorry, I didn't get that.";

    let data = input.entities.math_expression[0].value;
    data = data.replaceAll("the", "");
    data = data.toLowerCase();
    data = data.split(" ");
    var retData = "";
    for (i in data) {
      retData += word2num(data[i]) + " ";
    }

    data = retData;
    data = data.replaceAll("one", "1");
    data = data.replaceAll("two", "2");
    data = data.replaceAll("three", "3");
    data = data.replaceAll("four", "4");
    data = data.replaceAll("five", "5");
    data = data.replaceAll("six", "6");
    data = data.replaceAll("seven", "7");
    data = data.replaceAll("eight", "8");
    data = data.replaceAll("nine", "9");
    data = data.replaceAll("zero", "0");
    data = data.replaceAll("plus", "+");
    data = data.replaceAll("added to", "+");
    data = data.replaceAll("minus", "-");
    data = data.replaceAll("subtracted from", "-");
    data = data.replaceAll("times", "*");
    data = data.replaceAll("multiplied by", "*");
    data = data.replaceAll("divided by", "/");
    data = data.replaceAll("square root of", "sqrt(", ")");
    data = data.replaceAll("square of", "", "^2");
    data = data.replaceAll("square", "", "^2");
    data = data.replaceAll("cubed", "", "^3");
    data = data.replaceAll("cube", "", "^3");
    data = data.replaceAll("to the power of", "^");
    data = data.replaceAll("to power of", "^");
    data = data.replaceAll("x", "*");
    data = data.replaceAll("cosine of", "cos(", ")");
    data = data.replaceAll("cosine", "cos(", ")");
    data = data.replaceAll("sine of", "sin(", ")");
    data = data.replaceAll("sine", "sin(", ")");
    data = data.replaceAll("tangent of", "tan", ")");
    data = data.replaceAll("tangent", "tan(", ")");

    response = math.eval(data);

    resolve(response);
  }
}
