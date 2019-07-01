const thrift = require("thrift");
const Stats = require("./gen-nodejs/statsCalculationService");
const port = 9090;
const statsLib = require("stats-lite");
const ttypes = require('./gen-nodejs/stats_types');

const statStruct = new ttypes.StatStruct();

var server = thrift.createServer(Stats, {
  ping: function() {
    console.log('ping called');
    return true;
  },
  calculateStat: function(array) {
    console.log('calculateStat called');
    statStruct.mean = statsLib.mean(array)
    statStruct.median = statsLib.median(array)
    statStruct.variance = statsLib.variance(array)
    return statStruct
  },
  generateNums: function() {
    console.log('generateNums called');
    let count = 4*randomIntFromInterval(0, 3) + 4, num, resp = []

    for(let i = 0; i < count; i++) {
      if((i+1) <= count/4) {
        num = 2*randomIntFromInterval(1, 5) - 1
      } else {
        num = 2*randomIntFromInterval(0, 5)
      }
      resp.push(num)
    }

    return resp;
  }
});

server.listen(port, () => console.log('Running on port ' + port));

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}