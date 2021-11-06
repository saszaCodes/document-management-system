/* eslint-disable camelcase */
import { errorHandlers } from '../middleware';
import { UserProfiles, UserLogins } from '../models';

const { generic } = errorHandlers;

/** contains methods servicing search/ route */
class SearchService {
  /** initializes necessary models */
  constructor() {
    this.userProfiles = new UserProfiles();
    this.userLogins = new UserLogins();
  }

  /** Helper method. Finds a user matching given conditions
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @param {Object} conditions to match. Accepted conditions: email, username, id
   * @param {Number} limit (optional) limits number of results
   * @param {Number} offset (optional) offsets the results
   * @returns {Object} - if user is found, user's data is returned. If not, null is returned
   */
  searchForUsers = async (
    req,
    res,
    next,
    // conditions,
    // limit = Number.MAX_SAFE_INTEGER,
    // offset = 0
  ) => {
    try {
      // validate the request
      const { q } = req.query;
      let { searchBy } = req.query;
      if (!searchBy) {
        searchBy = 'username';
      }
      if (!q) {
        res.status(400).send('You must provide query parameters. If you want to fetch all users, send GET to /users endpoint');
        return;
      }
      let users;
      switch (searchBy) {
        default:
          res.status(400).send('You can only search users by following markers: username, email and fullname');
          return;
        // if request is valid, read from the database
        case 'username':
          users = await this.userProfiles.readWithLogins({ deleted_at: null, username: q });
          break;
        case 'email':
          users = await this.userProfiles.readWithLogins({ deleted_at: null, email: q });
          break;
        case 'fullname':
          users = await this.userProfiles.readWithLogins({ deleted_at: null, fullname: q });
          break;
      }
      console.log(q);
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
}

export default new SearchService();
