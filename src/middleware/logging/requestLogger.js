import morgan from 'morgan';
import { logger } from '../../lib';

const requestLogger = morgan(
  'tiny',
  {
    stream: {
      // slice() is there to remove newline at the end of each morgan log
      write: (info) => logger.http(info.slice(0, -1))
    }
  }
);

export default requestLogger;
