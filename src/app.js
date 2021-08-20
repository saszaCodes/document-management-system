import express from 'express';
import morganMiddleware from './loggingMiddleware/morgan';
import errorHandler from './errorHandler';

const app = express();
const { genericError } = errorHandler;

app.use(morganMiddleware);
app.get('/', (req, res) => {
  res.send('This is my first Express server');
});
app.use('/', (err, req, res, next) => {
  // if response has already started streaming and error occurs, pass it to Express
  // default error handler - it will close the connection and fail the request.
  if (res.headersSent) {
    next(err);
  } else {
    genericError(err, req, res);
  }
});

export default app;
