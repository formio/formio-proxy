var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var request = require('request');
var _ = require('lodash');
var config = require('./config.json');

// Creat eour application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

var protocol = config.protocol || 'https';
var host = config.host || 'form.io';
var baseUrl = protocol + '://' + config.project + '.' + host + '/';

_.each(config.forms, function(form) {
  app.post('/' + form, function(req, res, next) {
    console.log(req.body);
    request.post({
      url: baseUrl + form,
      body: req.body,
      json: true,
      headers: {
        'content-type': 'application/json',
        'x-jwt-token': req.headers['x-jwt-token']
      }
    }, function(err, response, body) {
      if (err) {
        return next(err);
      }

      // Send the response as it normally would.
      res.status(response.statusCode).json(body);
    });
  });

  app.put('/' + form + '/:submissionId', function(req, res, next) {
    console.log(req.body);
    request.put({
      url: baseUrl + form + '/submission/' + req.params.submissionId,
      body: req.body,
      json: true,
      headers: {
        'content-type': 'application/json',
        'x-jwt-token': req.headers['x-jwt-token']
      }
    }, function(err, response, body) {
      if (err) {
        return next(err);
      }

      // Send the response as it normally would.
      res.status(response.statusCode).json(body);
    });
  });

  app.delete('/' + form + '/:submissionId', function(req, res, next) {
    request.del({
      url: baseUrl + form + '/submission/' + req.params.submissionId,
      body: req.body,
      json: true,
      headers: {
        'content-type': 'application/json',
        'x-jwt-token': req.headers['x-jwt-token']
      }
    }, function(err, response, body) {
      if (err) {
        return next(err);
      }

      // Send the response as it normally would.
      res.status(response.statusCode).json(body);
    });
  });
});

console.log('Listening to port 4000');
app.listen(4000);
