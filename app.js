var express = require('express');
var path = require('path');
var request = require('request');
var qs = require('querystring');

var config = require(path.join(__dirname, 'config.js'));

var app = express();
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ethersource/:resource(findAssociations|findBackgroundAssociations)', function(req, res) {
  var resource = req.params.resource;
  console.log('Get resource: ' + resource + '.');

  var queryParams = {
    findAssociations: {
      apiKey: config.apiKey,
      userId: config.username,
      customerObserverId: config.customerObserverId,
      timestamp: req.query.timestamp,
      windowSize: req.query.windowSize,
      maxResults: 30
    },
    findBackgroundAssociations: {
      apiKey: config.apiKey,
      customerObserverId: config.customerObserverId,
      timestamp: req.query.timestamp,
      backlogInDays: 365, // 1 year
      maxResults: 30
    }
  };
  var params = {
    url: 'https://ethersource.gavagai.se/ethersource/rest/' + resource + '?' + qs.stringify(queryParams[resource]),
    auth: {
      username: config.username,
      password: config.password
    }
  };

  request(params).pipe(res);
});

app.listen(3013);
console.log('Listening on port 3013...');
