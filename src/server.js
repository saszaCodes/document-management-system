import app from './app';
import { logger } from './lib';

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
