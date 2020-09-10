module.exports = {
  formatNumber: num => {
    return format(num);
  },
  generatePasswordReset: () => {
    return generatePassword(8);
  },
  roundNumber: (num, scale) => {
    return round(num, scale);
  }
};

function round(num, scale) {
  let block = num % scale;
  num = block > 0 ? num - (num % scale) + scale : num;
  return num;
}

function format(num) {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0
  }).format(num);
}

function generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var allChars = numberChars + upperChars + lowerChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(
    randPasswordArray.map(function(x) {
      return x[Math.floor(Math.random() * x.length)];
    })
  ).join("");
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
