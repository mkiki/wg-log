/**
 * @file  Wilgeforte - Logging utilities.
 *
 * <p>Configuration is done throuh a wg-loggers.json file in the working dir of the process.
 *
 */
// (C) Alexandre Morin 2015 - 2016

const fs = require('fs');
const bunyan = require('bunyan');
const gelfStream = require('gelf-stream');
const Exception = require('./exception.js');


// ================================================================================
// Wraps a bunyan logger
// ================================================================================

/**
 * A Logger object, used to log messages
 * @param log - is the Bunyan logger (wrapped)
 */
function Logger(log) {
  this.log = log;
}

/**
 * Log a message with the DEBUG level
 * @memberOf Logger
 * @param {Object} data - Additional data associated to the message, as an object litteral
 * @param {string} message - The log message
 */
Logger.prototype.debug = function(data, message) {
  if (message === undefined) {
    if (data instanceof Exception) {
      var ex = data;
      this.log.debug({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.debug(data);
    }
  }
  else {
    if (message instanceof Exception) {
      var ex = message;
      this.log.debug({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.debug(data, message);
    }
  }
}

/**
 * Log a message with the INFO level
 * @memberOf Logger
 * @param {Object} data - Additional data associated to the message, as an object litteral
 * @param {string} message - The log message
 */
Logger.prototype.info = function(data, message) {
  if (message === undefined) {
    if (data instanceof Exception) {
      var ex = data;
      this.log.info({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.info(data);
    }
  }
  else {
    if (message instanceof Exception) {
      var ex = message;
      this.log.info({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.info(data, message);
    }
  }
}

/**
 * Log a message with the WARN level
 * @memberOf Logger
 * @param {Object} data - Additional data associated to the message, as an object litteral
 * @param {string} message - The log message
 */
Logger.prototype.warn = function(data, message) {
  if (message === undefined) {
    if (data instanceof Exception) {
      var ex = data;
      this.log.warn({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.warn(data);
    }
  }
  else {
    if (data instanceof Exception) {
      var ex = message;
      this.log.warn({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.warn(data, message);
    }
  }
}

/**
 * Log a message with the ERROR level
 * @memberOf Logger
 * @param {Object} data - Additional data associated to the message, as an object litteral
 * @param {string} message - The log message
 */
Logger.prototype.error = function(data, message) {
  if (message === undefined) {
    if (data instanceof Exception) {
      var ex = data;
      this.log.error({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else {
      this.log.error(data);
    }
  }
  else {
    if (message instanceof Exception) {
      var ex = message;
      this.log.error({data:ex.data, cause:ex.cause, stack:ex.stack}, ex.message);
    }
    else  {
      this.log.error(data, message);
    }
  }
}



// ================================================================================
// Configuration
// ================================================================================

// Cache of loggers (by name)
var loggers = { };
// Loggers configuration
var loggersConf = { };

// Load loggers configuration
var conf = process.cwd() + '/wg-loggers.json';
try {
  loggersConf = fs.readFileSync(conf, 'utf8')
  loggersConf = JSON.parse(loggersConf);
} catch (ex) {
  console.warn("Failed to load the loggers configuration file [" + conf + "]");
  loggersConf = {
    streams: [],
    loggers: {}
  }
}

// Configure streams
var defaultStreams = [];
for (var i=0; i<loggersConf.streams.length; i++) {
  var streamDef = loggersConf.streams[i];
  if (streamDef.type === 'graylog') {
    var stream = gelfStream.forBunyan(streamDef.host, streamDef.port);
    defaultStreams.push({ type:'raw', stream:stream });
  }
}

var log = getLogger('wg-log');


// ================================================================================
// Module API
// ================================================================================

/**
 * Get a logger by name
 * @param {string} name is the logger name
 * @return {Logger} a logger object 
 */
function getLogger(name) {
  var log = loggers[name];
  if (log === undefined) {
    var level = bunyan.resolveLevel("info");
    var loggerConfig = loggersConf.loggers[name];
    if (loggerConfig && loggerConfig.level) level = bunyan.resolveLevel(loggerConfig.level);

    var streams = defaultStreams.slice();
    // Default console stream
    streams.push({ type: 'stream',
       stream: process.stdout,
       closeOnExit: false,
       level: 10,
       level:level
    });

    log = bunyan.createLogger({ name:name,
                                streams: streams
                              });
    log = new Logger(log);
    loggers[name] = log;
  }
  return log;
}

/** 
 * Shutdown the logging system
 */
function shutdown(callback) {
  log.debug("Shutting down logging system");
  for (var i=0; i<defaultStreams.length; i++) {
    if (defaultStreams[i].stream && defaultStreams[i].closeOnExit !== false)
      defaultStreams[i].stream.end();
  }
  return callback();
}

/** ================================================================================
  * Public interface
  * ================================================================================ */
module.exports = {
  getLogger: getLogger,
  shutdown: shutdown
};
