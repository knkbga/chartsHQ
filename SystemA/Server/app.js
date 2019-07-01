const express = require('express');
const dnode = require('dnode');
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

const RCPclient = thrift.createClient(Stats, connection);

// REST API
const port = 3000;
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
    let valid = true
    arr.forEach(element => {
      if(isNaN(parseInt(element.trim()))) {
        console.log(element.trim());
        valid = false
      }
    });
    if(valid) {
      res.json({
        success: true,
      })
    } else {
      res.json({
        success: false,
        errMessage: 'Invalid input'
      })
    }
  } 
  else if (req.query.method == 'GEN-RAND') {
    RCPclient.generateNums()
    .then(function(response) {    
      res.json(response);
    })
  } 
  else if (req.query.method == 'CALCULATE-STATS'){
    RCPclient.calculateStat(arr)
    .then(function(response) {    
      statStruct.mean = response.mean
      statStruct.median = response.median
      statStruct.variance = response.variance
      res.json(statStruct)
    })
  }
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