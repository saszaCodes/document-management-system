import express from 'express';
import { errorHandlers } from '../middleware';
import { usersService } from '../services';

const usersRouter = express.Router();
const { generic } = errorHandlers;

usersRouter.get('/users', usersService.fetchActiveProfiles);
usersRouter.get('/users/:id', usersService.fetchProfile);
usersRouter.post('/users', usersService.createProfile);
usersRouter.put('/users/:id', usersService.updateProfile);
usersRouter.delete('/users/:id', usersService.deleteProfile);
usersRouter.post('/users/login', usersService.logIn);
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
