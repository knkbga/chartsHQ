var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

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
      .replace('}', '');
    
    arr = payload.split(',')
  }

  switch(req.query.method) {
    case 'IS-VALID-ENTRY': {
      res.json({
        success: true
      })  
    }
    break;

    case 'GEN-RAND': {
      res.json({
        data: [1,2,3,4,5,6,7]
      })
    }
    break;

    case 'CALCULATE-STATS': {
      res.json({
        data:{
          mean: 1,
          median: 2,
          variance: 1.33
        }
      })
    }
    break;
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