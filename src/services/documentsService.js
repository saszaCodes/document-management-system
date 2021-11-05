import { errorHandlers } from '../middleware';
import { Documents, UserProfiles } from '../models';

const { generic } = errorHandlers;

/** contains methods servicing documents/ route */
class DocumentsService {
  /** initializes necessary models */
  constructor() {
    this.documents = new Documents();
    this.userProfiles = new UserProfiles();
  }

  /** Helper method. Finds a document matching given conditions
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @param {Object} conditions - conditions to match. Accepted conditions: id
   * @returns {Object} - if document is found, its data is returned. If not, null is returned
   */
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

  /** creates new document in database and sends 200 OK status with its data if successfuly created
   * @param {Object} req - request object, expected properties: body.title*, body.body,
   * body.authorId* (* = required to create the document)
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
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
      const documents = await this.documents.create({ title, body, author_id: authorId });
      const document = documents[0];
      res.status(200).send(document);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** fetches document from the database and sends 200OK status with its data if successfuly fetched
   * @param {Object} req - request object, expected properties: params.id
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
  fetchDocument = async (req, res, next) => {
    const { id } = req.params;
    try {
      const documents = await this.findDocument(req, res, next, { id });
      if (documents === null) {
        res.status(404).send('Document not found');
        return;
      }
      const document = documents[0];
      res.status(200).send(document);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** updates the document in database and sends 200 OK status with its data if successfuly updated
   * @param {Object} req - request object, expected properties: params.id, body.title, body.body
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
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

  /** updates deleted_at column of a given document in database and sends 200 OK status
   *  with success message if successfuly updated
   * @param {Object} req - request object, expected properties: params.id
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
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
