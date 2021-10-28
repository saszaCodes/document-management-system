import express from 'express';
import { errorHandlers } from '../middleware';
import { documentsService } from '../services';

const documentsRouter = express.Router();
const { generic } = errorHandlers;

documentsRouter.post('/documents', documentsService.createDocument);
documentsRouter.get('/documents', documentsService.fetchDocuments);
documentsRouter.get('/documents/:id', documentsService.fetchDocument);
documentsRouter.put('/documents/:id', documentsService.updateDocument);
documentsRouter.delete('/documents/:id', documentsService.deleteDocument);
documentsRouter.use('/documents', (err, req, res, next) => {
  // if response has already started streaming and error occurs, pass it to Express
  // default error handler - it will close the connection and fail the request.
  if (res.headersSent) {
    next(err);
  } else {
    generic(err, req, res);
  }
});

export default documentsRouter;
