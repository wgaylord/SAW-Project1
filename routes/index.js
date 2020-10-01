'use strict';


const express = require('express');
const https = require('https');
const router = express.Router();
const axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index',{ title: 'POTA Activations'});
});

router.get('/testdata',function(req,res,next){
	axios.get('https://www.dph.illinois.gov/sitefiles/COVIDHistoricalTestResults.json')
		.then(function (response) {
		// handle success
		res.send(response.data)
		})
		.catch(function (error) {
		// handle error
		console.log(error);
	})
});

module.exports = router;
