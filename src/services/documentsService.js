/* eslint-disable require-jsdoc */
import { errorHandlers } from '../middleware';
import { Documents, UserProfiles } from '../models';

const { generic } = errorHandlers;

class DocumentsService {
  constructor() {
    this.documents = new Documents();
    this.userProfiles = new UserProfiles();
  }

  findDocument = async (req, res, next, conditions) => {
    const { id } = conditions;
    if (!id) {
      return null;
    }
    try {
      const document = await this.documents.read({ id });
      if (document.length === 0 || (document.length === 1 && document[0].deleted_at)) {
        return null;
      }
      return document[0];
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  createDocument = async (req, res, next) => {
    const { title, body, authorId } = req.body;
    try {
      if (!authorId) {
        res.status(400).send('Author\'s ID is required to create a new document');
        return;
      }
      if (!title && !body) {
        res.status(400).send('You have to add some title or document body');
        return;
      }
      const user = await this.userProfiles.read({ id: authorId });
      if (user.length === 0 || (user.length === 1 && user[0].deleted_at)) {
        res.status(400).send('Wrong author ID, such user doesn\'t exist');
        return;
      }
      const document = await this.documents.create({ title, body, author_id: authorId });
      res.status(200).send(document[0]);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  fetchDocument = async (req, res, next) => {
    const { id } = req.params;
    try {
      const document = await this.findDocument(req, res, next, { id });
      if (document === null) {
        res.status(404).send('Document not found');
        return;
      }
      res.status(200).send(document);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  updateDocument = async (req, res, next) => {
    const { title, body } = req.body;
    const { id } = req.params;
    try {
      if (!title && !body) {
        res.status(400).send('You have to update title or body');
        return;
      }
      const document = await this.findDocument(req, res, next, { id });
      if (document === null) {
        res.status(404).send('Document not found');
        return;
      }
      const newDocument = await this.documents.update({ id }, { title, body });
      res.status(200).send(newDocument[0]);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  deleteDocument = async (req, res, next) => {
    const { id } = req.params;
    try {
      const document = await this.findDocument(req, res, next, { id });
      if (document === null) {
        res.status(404).send('Document not found');
        return;
      }
      await this.documents.update({ id }, { deleted_at: new Date(Date.now()).toUTCString() });
      res.status(200).send('Document deleted');
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }
}

export default new DocumentsService();
