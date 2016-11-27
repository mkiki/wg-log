/**
 * wg-log - NPM package entry point
 */
// (C) Alexandre Morin 2015 - 2016

const Log = require('./lib/log.js');
const Exception = require('./lib/exception.js');


/**
 * Public interface
 */
module.exports = {
  Log: Log,
  Exception: Exception,
};
