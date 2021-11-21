import express from 'express';
import { errorHandlers } from '../middleware';
import { searchService } from '../services';

const searchRouter = express.Router();
const { generic } = errorHandlers;

searchRouter.get('/search/users', searchService.searchForUsers);
searchRouter.get('/search/documents', searchService.searchForDocs);
searchRouter.use('/search', (err, req, res, next) => {
  // if response has already started streaming and error occurs, pass it to Express
  // default error handler - it will close the connection and fail the request.
  if (res.headersSent) {
    next(err);
  } else {
    generic(err, req, res);
  }
});

export default searchRouter;
