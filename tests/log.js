/**
 * wg-log - Loggers unit tests
 */
// (C) Alexandre Morin 2015 - 2016

const assert = require('assert');
const Log = require('../lib/log.js');
const Exception = require('../lib/exception.js');
  
describe('Testing loggers', function() {

  it('Should create a logger', function(done) {
    var log = Log.getLogger("shouldCreateALogger");
    assert(log, "Logger created");
    log = Log.getLogger("shouldCreateALogger (2)", false);
    assert(log, "Logger created (2)");
    return done();
  });

  it('Should not create a logger', function(done) {
    var log = Log.getLogger("shouldNotCreateALogger", true);
    assert(!log, "Logger not created");
    return done();
  });

  it('Should use default configuration', function(done) {
    var log = Log.getLogger("Should use default configuration");
    assert.equal(log.level(), 30, "Default log level");
    return done();
  });

  it('Should set logger level', function(done) {
    var log = Log.getLogger("Should set logger level");
    log.configure({level:'debug'});
    assert.equal(log.level(), 20, "Level is now debug");
    return done();
  });

  it('Should load configuration file', function(done) {
    return Log.configure(__dirname + "/data/testConfig.json", function(err) {
      if (err) return done(err);
      assert.equal(30, Log.getLogger("core:web").level());
      assert.equal(20, Log.getLogger("photos:exif").level());
      assert.equal(30, Log.getLogger("photos:web").level());
      assert.equal(40, Log.getLogger("photos:scanner").level());
      return done();
    });
  });

  it('Should call log functions', function(done) {
    var log = Log.getLogger("Should call log functions");
    log.debug("Debug");
    log.info("Info");
    log.warn("Warn");
    log.error("Error");
    return done();
  });

});



