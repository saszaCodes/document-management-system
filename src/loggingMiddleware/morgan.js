import morgan from 'morgan';
import logger from './logger';

const morganMiddleware = morgan(
  'tiny',
  {
    stream: {
      write: (info) => logger.http(info.slice(0, -1))
    }
  }
);

export default morganMiddleware;
