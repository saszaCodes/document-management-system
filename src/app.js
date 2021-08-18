import express from 'express';
import morganMiddleware from './loggingMiddleware/morgan';
import logger from './loggingMiddleware/logger';

const app = express();

const PORT = process.env.port || 3000;

app.use(morganMiddleware);
app.get('/', (req, res) => {
  res.send('This is my first Express server');
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
