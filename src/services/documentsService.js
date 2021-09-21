import { userProfiles, documents } from '../models';

export const documentsService = {
  createDocument: async (req, res, next) => {
    const { title, body } = req.body;
    const authorId = req.body.author_id;
    // title and authorId are required, if it is not supplied, send 400 Bad Request status
    if (!title || !authorId) {
      res.status(400).send('Invalid request. Title and author_id need to be supplied');
      return;
    }
    // if authorId doesn't match existing user,
    // send 400 Bad Request
    const validId = await userProfiles
      .checkIfProfileExists({ id: authorId })
      .catch((err) => { next(err); });
    if (!validId) {
      res.status(400).send(`Invalid request. User with id ${authorId} doesn't exist.`);
      return;
    }
    // if document is successfully created, send its id, title and body
    const doc = await documents
      .addDocument(title, body, authorId)
      .catch((err) => { next(err); });
    res.status(200).send(doc);
  },
  fetchDocument: async (req, res, next) => {
    const { id } = req.params;
    // if document doesn't exist, send 404
    const documentExists = await documents
      .checkIfDocumentExists({ id })
      .catch((err) => { next(err); });
    if (!documentExists) {
      res.status(404).send('Document not found.');
      return;
    }
    // else, send the document
    const doc = await documents
      .getDocumentById(id)
      .catch((err) => { next(err); });
    res.status(200).send(doc);
  },
  updateDocument: async (req, res, next) => {
    const { title, body } = req.body;
    const { id } = req.params;
    // if no update values are supplied in request,
    // return 400 Bad Request status
    if (!title && !body) {
      res.status(400).send('Invalid request.');
      return;
    }
    // if document doesn't exist, send 404 Not Found status
    const documentExists = await documents
      .checkIfDocumentExists({ id })
      .catch((err) => { next(err); });
    if (!documentExists) {
      res.status(404).send('Document doesn\'t exist.');
      return;
    }
    // else, send updated document data back
    const updatedColumns = await documents
      .updateDocument(id, { title, body })
      .catch((err) => { next(err); });
    res.status(200).send(updatedColumns);
  },
  deleteDocument: async (req, res, next) => {
    const { id } = req.params;
    // if document doesn't exist, send 404 Not Found status
    const documentExists = await documents
      .checkIfDocumentExists({ id })
      .catch((err) => { next(err); });
    if (!documentExists) {
      res.status(404).send('Document doesn\'t exist.');
      return;
    }
    await documents
      .updateDocument(id, { deleted_at: new Date(Date.now()).toUTCString() })
      .catch((err) => { next(err); });
    res.status(200).send('Document successfully deleted.');
  }
};
