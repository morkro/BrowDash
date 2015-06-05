/* JSHint needs to know that this runs in Node.js */
/* jshint strict: false */

/**
 * Setup.
 * ==============================
 */
var express		= require('express');
var fs			= require('fs');
var server		= express();

var DIRECTORY	= '/public';
var INDEX 		= '/index.html';
var PORT			= process.env.PORT || 9000;

/**
 * Create environment.
 * ==============================
 */
server.use('/', express.static(__dirname + DIRECTORY));

server.on('render:index', function(encoding, req, res) {
	var file = DIRECTORY + INDEX;
	fs.readFile(file, encoding, function(err, html) {
		res.contentType('text/html');
		res.status(200).send(html);
	});
});

server.get('*', function(req, res, next) {
	next();
});
server.get('/', function(req, res, next) {
	server.emit('render:index', 'UTF-8', req, res);
});
server.get(INDEX, function(req, res, next) {
	server.emit('render:index', 'UTF-8', req, res);
});

/**
 * Get server running.
 * ==============================
 */
server.listen(PORT, function() {
	console.log('Hurray! Your server runs on http://localhost:' + PORT);
});