# A simple logging library

## Usage

	const Log = require('wg-log').Log;
	const Exception = require('wg-log').Exception;

	const log = Log.getLogger('main');

	if (err) log.warn(new Exception({module:moduleName}, "Failed to start module", err));

	if (err) return callback(new Exception(undefined, "Failed to start new module", err));


## Logging

We're using [Bunyan](https://github.com/trentm/node-bunyan) for logging. This is wrapped into the wg ```Log``` object.

To get a logger, simply call

	const log = Log.getLogger("MyLoggerName");

Loggers support the standard ```debug```, ```info```, ```warn```, ```error``` methods.


## Exceptions

The ```Exception``` object is a simple generic exception object, supporting:

* To store attribute values
* Add an exception message
* Chain a cause exception (or error)



## Configuration

Loggers can be configured programmatically as follows

	const Log = require('wg-log').Log;
	const log = Log.getLogger("logger-name");
	log.configure({
		level:["debug"|"info"|"warn"|"error"]
	};

Alternatively, configuration can be made through a configuration file

	const Log = require('wg-log').Log;
	return Log.configure(__dirname + "/loggers-config.json", function(err) {
		...

Where the configuration file will contain configuration options for all loggers

	{
	  "loggers": {
	      "core:web":             { "level": "info" }, 
	      "photos:exif":          { "level": "debug" },
	      "photos:web":           { "level": "info" }, 
	      "photos:scanner":       { "level": "warn" }
	  }
	}



