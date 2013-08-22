var express = require('express');
var path = require('path');

var app = express();
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3013);
console.log('Listening on port 3013...');
