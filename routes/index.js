'use strict';

const express = require('express');
const https = require('https');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index',{ title: 'POTA Activations'});
});

module.exports = router;
