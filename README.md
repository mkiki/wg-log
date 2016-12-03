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



## Automatic configuration

Configuration is done through a file called ```wg-loggers.json``` in the process working directory.
The configuration object contains the following sections

* streams which describes where log are sent
* loggers which describes the configuration of each named logger

Currently, only the ```graylog``` stream type is supported. It is configured with the graylog2 server host and port, and is will send data to a UDP GELF input stream on this host/port


## Programmatic configuration

Loggers can be configured programmatically as follows

	const Log = require('wg-log').Log;
	Log.configure("logger-name", {
		level:["debug"|"info"|"warn"|"error"]
	});

