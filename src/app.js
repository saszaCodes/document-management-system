import express from 'express';
import errorHandler from './errorHandler';

const app = express();
const PORT = process.env.port || 3000;
const { genericError } = errorHandler;

app.use('/', (err, req, res, next) => {
  // if response has already started streaming and error occurs, pass it to Express
  // default error handler - it will close the connection and fail the request.
  if (res.headersSent) {
    next(err);
  } else {
    genericError(err, req, res);
  }
});

app.get('/', (req, res) => {
  res.send('This is my first Express server');
});

export default app;
