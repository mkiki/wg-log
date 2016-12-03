/**
 * @file wg-log - Logging utilities
 */
// (C) Alexandre Morin 2015 - 2016

const fs = require('fs');
const bunyan = require('bunyan');

const Exception = require('./exception.js');


// Cache of loggers (by name)
var loggers = { };
// Loggers configuration. Key is logger name, value is logger configuration
var loggersConf = { };



/** ================================================================================
  * Type definitions
  * ================================================================================ */

/**
 * @typedef LoggerConfig
 * @property {string} level - the log level. On of "debug", "info", "warn", or "error"
 */



// ================================================================================
// Wraps a bunyan logger
// ================================================================================

/**
 * A Logger object, used to log messages
 * @param {string} name - is the logger's name
 * @param log - is the Bunyan logger (wrapped)
 */
function Logger(name, log) {
  this.name = name;
  this.log = log;
}

/**
 * Get the logger level
 * @memberOf Logger
 * @return {integer} The log level (20=debug, 30=info, 40=warn, 50=error)
 */
Logger.prototype.level = function() {
  return this.log.level();
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

/**
 * Configure the logging system from a configuration file
 * @param {string} fileName - is the name of the configuration file
 */
function configure(fileName, callback) {
  return fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) return callback(new Exception({fileName:fileName}, "Failed to read log configuration file", err));
    data = JSON.parse(data);
    var keys = Object.keys(data.loggers);
    for (var i=0; i<keys.length; i++) {
      var k = keys[i];
      var conf = data.loggers[k];
      loggersConf[k] = conf;
    }
    return callback();
  });
}

/**
 * Configure / reconfigure the logger
 * @param {LoggerConfig} options - The logger configuration
 */
Logger.prototype.configure = function(options) {
  var that = this;
  var loggerName = that.name; 
  loggersConf[loggerName] = options;
  var bunyanLogger = _createBunyanLogger(loggerName);
  that.log = bunyanLogger;
  getLogger(loggerName);
}


function _createBunyanLogger(name) {
  var level = bunyan.resolveLevel("info");
  var loggerConfig = loggersConf[name];
  if (loggerConfig && loggerConfig.level) level = bunyan.resolveLevel(loggerConfig.level);

  var stdout = {
    type: 'stream',
    stream: process.stdout,
    closeOnExit: false,
    level: level
  };

  log = bunyan.createLogger({ name:name, streams: [stdout] });
  return log;
}

// ================================================================================
// Module API
// ================================================================================

/**
 * Get a logger by name. If the logger does not exist yet, it will be created.
 *
 * @param {string} name - is the logger name
 * @param {boolean} doNotCreate - If set, then the logger will not be created if it does not exist
 * @return {Logger} a logger object 
 */
function getLogger(name, doNotCreate) {
  var log = loggers[name];
  var create = doNotCreate === undefined || !doNotCreate;
  if (create && log === undefined) {
    log = _createBunyanLogger(name);
    log = new Logger(name, log);
    loggers[name] = log;
  }
  return log;
}


/** ================================================================================
  * Public interface
  * ================================================================================ */
module.exports = {
  getLogger: getLogger,
  configure: configure
};
