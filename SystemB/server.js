const thrift = require("thrift");
const Stats = require("./gen-nodejs/statsCalculationService");
const port = 9090;
const statsLib = require("stats-lite");

var server = thrift.createServer(Stats, {
  ping: function() {
    console.log("ping()");
  },
  stats: function(array) {
    return {
      mean: statsLib.mean(array),
      median: statsLib.median(array),
      variance: statsLib.variance(array)
    }
  },
  genRandom: function(array) {
    let count = randomIntFromInterval(0, 10), num, array

    for(let i = 0; i < count; i++) {
      num = randomIntFromInterval(0, 10)
      array.push(num)
    }

    return array;
  }
});

server.listen(port, () => console.log('Running on port ' + port));

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}