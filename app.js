var express = require('express');
var path = require('path');
var request = require('request');
var qs = require('querystring');

var config = require(path.join(__dirname, 'config.js'));

var app = express();
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));

var getCurrentTime = function() {
  var date = new Date();
  return date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' +
    ('00' + date.getUTCHours()).slice(-2) + ':' +
    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
    ('00' + date.getUTCSeconds()).slice(-2) +
    ' UTC';
};

app.get('/ethersource/:resource(findAssociations|findBackgroundAssociations)', function(req, res) {
  var resource = req.params.resource;
  console.log('Get resource: ' + resource + '.');

  var queryParams = {
    findAssociations: {
      apiKey: config.apiKey,
      userId: config.username,
      customerObserverId: config.customerObserverId,
      timestamp: getCurrentTime(),
      windowSize: 2, // 2 days
      maxResults: 30
    },
    findBackgroundAssociations: {
      apiKey: config.apiKey,
      customerObserverId: config.customerObserverId,
      timestamp: getCurrentTime(),
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
