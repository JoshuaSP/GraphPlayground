var gzippo = require('gzippo');
var express = require('express');
var app = express();
var logger = require('morgan');
 
app.use(logger);
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
	res.sendFile('index.html')
})