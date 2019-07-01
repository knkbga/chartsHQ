const express = require('express');
const thrift = require('thrift');
const Stats = require("./gen-nodejs/statsCalculationService");
const assert = require('assert');
const ttypes = require('./gen-nodejs/stats_types');
const portForRPC = 9090

// RPC Client
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;
const statStruct = new ttypes.StatStruct();

var connection = thrift.createConnection("localhost", portForRPC, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

const RPCclient = thrift.createClient(Stats, connection);

// REST API
const port = 8080;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  // console.log('In the middleware');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/actions', (req, res, next) => {
  console.log('In /actions');
  
  let payload, arr
  if(req.query.payload !== undefined) {
    payload = req.query.payload
      .replace('{entry:', '')
      .replace(/ /g, '')
      .replace('}', '')
      .replace('[', '')
      .replace(']', '')
    
    arr = payload.split(',')
  }

  if (req.query.method == 'IS-VALID-ENTRY') {
    console.log('\tIn IS-VALID-ENTRY');
    let valid = true
    arr.forEach(element => {
      if(isNaN(parseInt(element.trim()))) {
        console.log(element.trim());
        valid = false
      }
    });
    if(valid) {
      return res.json({
        success: true,
      })
    } else {
      return res.json({
        success: false,
        errMessage: 'Invalid input'
      })
    }
  } 
  else if (req.query.method == 'GEN-RAND') {
    console.log('\tIn GEN-RAND');

    return RPCclient.generateNums(function(err, response) {
      if(err) {
        console.log("\t\terr found:\t", err);
        res.json({
          success: false
        })
      } else {
        console.log("\t\tresponse for generateNums:\t", response);
        res.json({
          success: true,
          data: response
        })
      }
    })
  } 
  else if (req.query.method == 'CALCULATE-STATS'){
    console.log("\tIn CALCULATE-STATS");

    let inputArg = []
    arr.forEach((element, index) => {
      inputArg[index] = parseInt(element.trim())
    });
    
    return RPCclient.calculateStat(inputArg, function(err, response) {
      if(err) {
        console.log("\t\terr found:\t", err);
      } else {
        console.log("response for generateNums:\t", response);
        res.json({
          success: true,
          data: response
        })
      }
    })
  }
  next()
})

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.status('404')
  res.json({
    error: true,
    message: '404 Not Found'
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}`))