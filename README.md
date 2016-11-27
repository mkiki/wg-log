# wg-log - A simple logging library

## Logging

We're using [Bunyan](https://github.com/trentm/node-bunyan) for logging. This is wrapped into the wg ```Log``` object.

To get a logger, simply call

	const log = Log.getLogger("MyLoggerName");

### Logging configuration

Configuration is done through a file called wg-loggers.json in the process working directory.
The configuration object contains the following sections

* streams which describes where log are sent
* loggers which describes the configuration of each named logger

Currently, only the ```graylog``` stream type is supported. It is configured with the graylog2 server host and port, and is will send data to a UDP GELF input stream on this host/port


## Exceptions