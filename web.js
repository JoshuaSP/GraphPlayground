// var gzippo = require('gzippo');
var express = require('express');
var app = express();
var logger = require('morgan');
 var path = require('path')

// app.use(logger);

// app.use(express.static(path.join(__dirname, 'dist')));
// app.use(gzippo.staticGzip("" + __dirname + "/dist"));
// app.listen(process.env.PORT || 5000);


// var express = require('express');
// var app = express();
// var path = require('path');

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'dist'))); //  "public" off of current is root

app.listen(process.env.PORT || 5000);
console.log('Listening on port 80');