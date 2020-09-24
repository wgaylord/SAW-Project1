'use strict';

const express = require('express');
const https = require('https');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // Reference: https://nodejs.org/api/https.html#https_https_get_options_callback
  const url = 'https://api.pota.us/activation'

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on('data', function(data){
      const potaData = JSON.parse(data)
      const activatorData = potaData[1].activator
      const frequencyData = potaData[1].frequencies
      //console.log(activatorData);
      //console.log(frequencyData);
      res.render('index', { title: 'The activator: ' + activatorData + ' online on frequency: ' + frequencyData });
    });
  });

  //res.render('index', { title: 'Express' });
});

module.exports = router;
