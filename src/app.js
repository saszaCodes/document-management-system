import express from 'express';
// core-js and regenerator-runtime imports are necessary for babel to polyfill some ES6 features
// and run polyfilled functions correctly
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { errorHandlers, logging } from './middleware';
import { usersRouter, documentsRouter, searchRouter } from './routes';

const app = express();
const { generic } = errorHandlers;
const { requestLogger } = logging;

app.use(requestLogger);
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get('/', (req, res) => {
  res.send('This is my first Express server');
});
app.use(usersRouter);
app.use(documentsRouter);
app.use(searchRouter);
app.use('/', (err, req, res, next) => {
  // if response has already started streaming and error occurs, pass it to Express
  // default error handler - it will close the connection and fail the request.
  if (res.headersSent) {
    next(err);
  } else {
    generic(err, req, res);
  }
});

export default app;
