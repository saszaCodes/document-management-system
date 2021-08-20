import express from 'express';
import errorHandler from './errorHandler';

const app = express();
const PORT = process.env.port || 3000;
const { genericError } = errorHandler;

const PORT = process.env.port || 3000;

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
