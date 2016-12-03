/**
 * wg-log - Exception unit tests
 */
// (C) Alexandre Morin 2015 - 2016

const assert = require('assert');
const Log = require('../lib/log.js');
const Exception = require('../lib/exception.js');
  
describe('Testing exceptions', function() {

  const log = Log.getLogger('wg-log::exception::tests');

  it('Should not fail', function(done) {
    var cause = new Exception({count:3}, "Cannot open file");

    log.error(new Exception("Failed to run command"));      // Exception made of a simple message
    log.error(new Exception({x:1}, "Failed"));              // Exception with associated data
    log.error(new Exception({x:1}, "Failed", cause));       // Exception with a cause

    log.warn(new Exception("Failed to run command"));       // Exception made of a simple message
    log.warn(new Exception({x:1}, "Failed"));               // Exception with associated data
    log.warn(new Exception({x:1}, "Failed", cause));        // Exception with a cause

    log.info(new Exception("Failed to run command"));       // Exception made of a simple message
    log.info(new Exception({x:1}, "Failed"));               // Exception with associated data
    log.info(new Exception({x:1}, "Failed", cause));        // Exception with a cause

    log.debug(new Exception("Failed to run command"));      // Exception made of a simple message
    log.debug(new Exception({x:1}, "Failed"));              // Exception with associated data
    log.debug(new Exception({x:1}, "Failed", cause));       // Exception with a cause

    return done();
  });

});



