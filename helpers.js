
/* returns a random integer that will serve as the id of the message */
function getRandInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports.getRandInt = getRandInt;