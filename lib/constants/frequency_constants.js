//for initial setup (piece randomization)

let FrequencyConstants = {};

for(let i = 1; i <= 45; i++) {
  FrequencyConstants[i] = "grass";
}

for(let i = 46; i <= 60; i++) {
  FrequencyConstants[i] = "bush";
}

for(let i = 61; i <= 65; i++) {
  FrequencyConstants[i] = "tree";
}

for(let i = 66; i <= 67; i++) {
  FrequencyConstants[i] = "hut";
}

for(let i = 68; i <= 70; i++) {
  FrequencyConstants[i] = "bear";
}

let increaseFrequency = function (piece, num) {
  let length = Object.keys(FrequencyConstants).length;
  for(let i = 1; i <= num; i++) {
    FrequencyConstants[length + i] = piece;
  }
};

module.exports = FrequencyConstants;
