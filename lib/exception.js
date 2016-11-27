/**
 * @file  Wilgeforte - Simple exception management
 *
 */
// (C) Alexandre Morin 2015 - 2016

const Log = require('./log.js');

/**
 * Create an exception
 *
 * new Exception("Failed to run command"));      // Exception made of a simple message
 * new Exception({x:1}, "Failed"));              // Exception with associated data
 * new Exception({x:1}, "Failed", cause));       // Exception with a cause (cause is an exception)
 */
function Exception(data, message, cause) {

  if (cause === undefined && message === undefined) {
    message = data;
    data = undefined;
  }

  this.data = data;
  this.message = message;
  this.cause = cause;
  this._stack = new Error().stack.split("\n");		// name it "_stack" because "stack" seems to be used by bunyan / bunyanToGelf
}


/**
 * Public module interface
 */
module.exports = Exception;
