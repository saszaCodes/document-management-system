import express from 'express';
import { errorHandlers } from '../middleware';
import { userProfilesService } from '../services';

const usersRouter = express.Router();
const { generic } = errorHandlers;

usersRouter.get('/users', userProfilesService.fetchAllProfiles);
usersRouter.get('/users/:id', userProfilesService.fetchProfile);
usersRouter.post('/users', userProfilesService.createProfile);
usersRouter.put('/users/:id', userProfilesService.updateProfile);
usersRouter.delete('/users/:id', userProfilesService.deleteProfile);
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
