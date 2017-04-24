var winston = require( 'winston' ),path = require('path'),
  logconfigFile = require(__dirname+ '/../config/logconfig.json');
	env= process.env.NODE_ENV || 'development';
     
  
 

 var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: logconfigFile.logging.application.file.level,
            filename:logconfigFile.logging.application.file.filename,
            handleExceptions: true,
            json: logconfigFile.logging.application.file.json,
            maxsize: logconfigFile.logging.application.file.maxsize, //5MB
            maxFiles: logconfigFile.logging.application.file.maxfiles,
            colorize: false
        }),
        new winston.transports.Console({
            level: logconfigFile.logging.application.console.level,
            handleExceptions: true,
            json: false,
            colorize: logconfigFile.logging.application.console.colorize
        })
    ],
    exitOnError: false
}); 
var httplogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: logconfigFile.logging.http.file.level,
            filename:logconfigFile.logging.http.file.filename,
            handleExceptions: true,
            json: logconfigFile.logging.http.file.json,
            maxsize: logconfigFile.logging.http.file.maxsize, //5MB
            maxFiles: logconfigFile.logging.http.file.maxfiles,
            colorize: false
        }),
        new winston.transports.Console({
            level: logconfigFile.logging.http.console.level,
            handleExceptions: true,
            json: false,
            colorize: logconfigFile.logging.http.console.colorize
        })
    ],
    exitOnError: false
});
logger.info('LOGMESSAGE');
module.exports = logger;
module.exports.httplogger = {
    write: function(message, encoding){
        httplogger.info(message);
    }
};

//  function ignoreEpipe(err) {
//     return err.code !== 'EPIPE';
//   }
