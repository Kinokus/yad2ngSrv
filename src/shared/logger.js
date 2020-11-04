"use strict";
/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */
exports.__esModule = true;
var winston_1 = require("winston");
// Import Functions
var File = winston_1.transports.File, Console = winston_1.transports.Console;
// Init Logger
var logger = winston_1.createLogger({
    level: 'info'
});
/**
 * For production write to all logs with level `info` and below
 * to `combined.log. Write all logs error (and below) to `error.log`.
 * For development, print to the console.
 */
if (process.env.NODE_ENV === 'production') {
    var fileFormat = winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json());
    var errTransport = new File({
        filename: './logs/error.log',
        format: fileFormat,
        level: 'error'
    });
    var infoTransport = new File({
        filename: './logs/combined.log',
        format: fileFormat
    });
    logger.add(errTransport);
    logger.add(infoTransport);
}
else {
    var errorStackFormat = winston_1.format(function (info) {
        if (info.stack) {
            // tslint:disable-next-line:no-console
            console.log(info.stack);
            return false;
        }
        return info;
    });
    var consoleTransport = new Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple(), errorStackFormat())
    });
    logger.add(consoleTransport);
}
exports["default"] = logger;
