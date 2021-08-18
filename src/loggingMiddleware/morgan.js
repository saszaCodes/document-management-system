import morgan from 'morgan';
import logger from './logger';

const morganMiddleware = morgan(
  'tiny',
  {
    stream: {
      // slice() is there to remove newline at the end of each morgan log
      write: (info) => logger.http(info.slice(0, -1))
    }
  }
);

export default morganMiddleware;
