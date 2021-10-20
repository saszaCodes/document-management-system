import express from 'express';
import { errorHandlers } from '../middleware';
import { usersService } from '../services';

const usersRouter = express.Router();
const { generic } = errorHandlers;

usersRouter.get('/users/:id', usersService.fetchUser);
usersRouter.post('/users', usersService.createUser);
usersRouter.put('/users/:id', usersService.updateUser);
usersRouter.delete('/users/:id', usersService.deleteUser);
usersRouter.use('/users', (err, req, res, next) => {
  // if response has already started streaming and error occurs, pass it to Express
  // default error handler - it will close the connection and fail the request.
  if (res.headersSent) {
    next(err);
  } else {
    generic(err, req, res);
  }
});

export default usersRouter;
