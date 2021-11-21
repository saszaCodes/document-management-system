/* eslint-disable camelcase */
import { errorHandlers } from '../middleware';
import { UserProfiles, UserLogins, Documents } from '../models';

const { generic } = errorHandlers;

/** contains methods servicing search/ route */
class SearchService {
  /** initializes necessary models */
  constructor() {
    this.userProfiles = new UserProfiles();
    this.userLogins = new UserLogins();
    this.documents = new Documents();
  }

  /** Finds users matching given query (expected query params: q, searchBy)
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}
   */
  searchForUsers = async (req, res, next) => {
    try {
      // validate the request
      const { q } = req.query;
      let { searchBy } = req.query;
      if (!searchBy || (searchBy !== 'username' && searchBy !== 'email' && searchBy !== 'fullname')) {
        searchBy = 'username';
      }
      if (!q) {
        res.status(400).send('You must provide query parameters. If you want to fetch all users, send GET to /users endpoint');
        return;
      }
      const conditionsStr = [`${searchBy}`, 'like', `%${q}%`];
      const users = await this.userProfiles.readWithLogins(null, conditionsStr);
      // if no users are found, send 200 OK with appropriate info
      if (users.length === 0) {
        res.status(200).send('No users matching your criteria were found');
        return;
      }
      // else, send 200 OK with users' data
      res.status(200).send(users);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** Finds documents matching given query (expected query param: q)
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}
   */
  searchForDocs = async (req, res, next) => {
    try {
      // validate the request
      const { q } = req.query;
      if (!q) {
        res.status(400).send('You must provide query parameters. If you want to fetch all users, send GET to /users endpoint');
        return;
      }
      const conditionsArr = ['title', 'like', `%${q}%`];
      const docs = await this.documents.read(null, conditionsArr);
      // if no documents are found, send 200 OK with appropriate info
      if (docs.length === 0) {
        res.status(200).send('No users matching your criteria were found');
        return;
      }
      // else, send 200 OK with documents' data
      res.status(200).send(docs);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }
}

export default new SearchService();
