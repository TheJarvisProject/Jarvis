module.exports = {
  requirements: "[*] {math_expression}",
  //plus, minus, times, divide, divided, multiply, add, subtract, +, -, *, x, /, sqrt, square, cube, cubed, squared, power, base, log, sin, sine, cos, cosine, tan, tangent
  name: "Math.js",
  version: "0.1.0",
  OnLoad: function() {
    this.Info(this.name + " " + this.version + " loaded!");
  },

  run: function(input, request) {
    var math = require('mathjs');
    var response;

    var data = input.entities.math_expression[0].value;

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

    response = math.eval(data);

    return response;
  }
}
