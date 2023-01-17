/*
 * Copyright (C) 2017 Jason Henderson
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */
const log = require('electron-log');

const logInfoFilePath = __dirname + '/..' + '/log/server-log.log';

log.transports.console.level = false;
log.transports.file.level = 'debug';
log.transports.file.file = logInfoFilePath;

log.info('inside child express process...');

/**
 * Module dependencies.
 */

require('dotenv').config();
const os = require('os');
const fs = require('fs');

const express = require('express');
const app = express();

const debug = require('debug')('config:server');
//const https = require('https');
const http = require('http');
//const privateKey = fs.readFileSync(__dirname + '/ssl-cert/key.pem', 'utf8');
//const certificate = fs.readFileSync(__dirname + '/ssl-cert/key.crt', 'utf8');
//const credentials = { key: privateKey, cert: certificate };

/**
 * Get port from environment and store in Express.
 */

// Port 4332 is currently unassigned and not widely used
// We will use it as a default HTTP channel
var port = normalizePort(process.env.SERVER_PORT || '3000');
log.info('process.env.SERVER_PORT ' + process.env.SERVER_PORT);
log.info('process.env.SERVER_IP ' + process.env.SERVER_IP);

app.set('port', port);

/**
 * Create HTTP server.
 */

//const httpsServer = https.createServer(credentials, app);
//const api = require(__dirname + '/../app.js')(httpsServer, log);
const config = process.env;
const httpServer = http.createServer( app);
const api = require(__dirname + '/../app.js')(httpServer, log);

app.use('/', express.static(__dirname + '/../public'));
app.use('/api', api);


/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  log.error('Server Error => ' + JSON.stringify(error));
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    	case 'EACCES':
     	  log.error(bind + ' requires elevated privileges');
     	  process.exit(1);
      break;
    	case 'EADDRINUSE':
     	  log.error(bind + ' is already in use');
      	process.exit(1);
        break;
    	default:
        throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
