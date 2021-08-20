import app from './app';
import logger from './loggingMiddleware/logger';

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
