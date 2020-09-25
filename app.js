'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socket = require('socket.io')();
const schedule = require('node-schedule');
const https = require('https');

const indexRouter = require('./routes/index');

const app = express();

const url = 'https://api.pota.us/activation' //Parks on the Air url

var lastRequest = {} //Initalize empty Object

https.get(url, function(response){
    response.on('data', function(data){
		lastRequest = JSON.parse(data) //TODO: Add error handling
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// send a message on successful socket connection
socket.on('connection', function(clientSocket){
  clientSocket.emit('init', lastRequest);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var checkingJob = schedule.scheduleJob('*/10 * * * *', function(){
	
	https.get(url, function(response){
    response.on('data', function(data){
		const potaData = JSON.parse(data) //TODO: Add error handling
		if(potaData!=lastRequest){
			//TODO: Compare entries and find differnces and use io.emit to send to client.
			lastRequest = potaData
		}
		});
	});
});

module.exports = {app, socket};
