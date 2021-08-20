import winston from 'winston';

const env = process.env.NODE_ENV || 'development';
const {
  combine,
  timestamp,
  colorize,
  printf
} = winston.format;
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};
const level = env === 'development' ? 'debug' : 'warn';
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'green',
  debug: 'white'
};
// Two separate formats need to be created, because colorize() causes reduntant characters
// to show up in the log file.
const consoleFormat = combine(
  timestamp({ format: 'YYY-MM-DD HH:mm:ss:ms' }),
  colorize({ all: true }),
  printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
const fileFormat = combine(
  timestamp({ format: 'YYY-MM-DD HH:mm:ss:ms' }),
  printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
const transports = env !== 'development'
  ? [new winston.transports.File({
    filename: './logs.log',
    format: fileFormat,
  })]
  : [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: './logsDev.log',
      format: fileFormat,
    })
  ];
winston.addColors(colors);
const logger = winston.createLogger({
  level,
  levels,
  transports
});

export default logger;
