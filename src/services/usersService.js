import { errorHandlers } from '../middleware';
import { UserProfiles, UserLogins, Documents } from '../models';

const { generic } = errorHandlers;

/** contains methods servicing users/ route */
class UsersService {
  /** initializes necessary models */
  constructor() {
    this.userProfiles = new UserProfiles();
    this.userLogins = new UserLogins();
    this.documents = new Documents();
  }

  /** Helper method. Finds a user matching given conditions
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @param {Object} conditions to match. Accepted conditions: email, username, profileId
   * @returns {Object} - if user is found, user's data is returned. If not, null is returned
   */
  findUser = async (req, res, next, conditions) => {
    const { email, username, profileId } = conditions;
    if (!username && !email && !profileId) {
      return null;
    }
    let userProfile = null;
    let userLogin = null;
    try {
      if (email) {
        userProfile = await this.userProfiles.read({ email });
        if (userProfile.length === 0 || (userProfile.length === 1 && userProfile[0].deleted_at)) {
          return null;
        }
        userLogin = await this.userLogins.read({ user_profile_id: userProfile[0].id });
      }
      if (profileId) {
        userProfile = await this.userProfiles.read({ id: profileId });
        if (userProfile.length === 0 || (userProfile.length === 1 && userProfile[0].deleted_at)) {
          return null;
        }
        userLogin = await this.userLogins.read({ user_profile_id: userProfile[0].id });
      }
      if (username) {
        userLogin = await this.userLogins.read({ username });
        if (userLogin.length > 0) {
          userProfile = await this.userProfiles.read({ id: userLogin[0].user_profile_id });
          if (userProfile.length === 0 || (userProfile.length === 1 && userProfile[0].deleted_at)) {
            return null;
          }
        }
      }
      return { userLogin, userProfile };
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** creates new user in database and sends 200 OK status with user's data if successfuly created
   * @param {Object} req - request object, expected properties:
   *  body.email*, body.fullname, body.username*, body.password* (* = required to create the user)
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
  createUser = async (req, res, next) => {
    const {
      email,
      fullname,
      username,
      password
    } = req.body;
    try {
      // email, username and password are required,
      // if they are not supplied, send 400 Bad Request status
      if (!email || !password || !username) {
        res.status(400).send('Invalid request. New user\'s email, username and password need to be supplied');
        return;
      }
      // emails and usernames need to be unique, if they already exist, send 400 Bad Request status
      const user = await this.findUser(req, res, next, { email, username });
      if (user !== null) {
        res.status(400).send('Username or email already in use.');
        return;
      }
      // create entry in user_profiles table;
      const userProfile = await this.userProfiles.create({ email, fullname });
      // create entry in user_logins table
      // eslint-disable-next-line camelcase
      const user_profile_id = userProfile[0].id;
      const userLogin = await this.userLogins.create({ user_profile_id, username, password });
      // if user is successfully created, send their email, fullname and id
      const newUser = {
        id: userProfile[0].id,
        email: userProfile[0].email,
        fullname: userProfile[0].fullname,
        username: userLogin[0].username
      };
      res.status(200).send(newUser);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** fetches user from database and sends 200 OK status with user's data if successfuly fetched
   * @param {Object} req - request object, expected properties: params.id
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
  fetchUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).send('You have to supply an id to GET user.');
        return;
      }
      // if user doesn't exist, send 404
      const user = await this.findUser(req, res, next, { profileId: id });
      if (user === null) {
        res.status(404).send('User not found');
        return;
      }
      // else, send 200 with user data
      const userData = {
        username: user.userLogin[0].username,
        email: user.userProfile[0].email,
        fullname: user.userProfile[0].fullname,
        id: user.userProfile[0].id
      };
      res.status(200).send(userData);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** fetches all documents created by given user
   * @param {Object} req - request object, expected properties: params.id
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}
   */
  fetchUsersDocuments = async (req, res, next) => {
    try {
      const { id } = req.params;
      // const user = await this.findUser(req, res, next, { profileId: id });
      // if (user === null) {
      //   res.status(404).send('User not found');
      //   return;
      // }
      const docs = await this.documents.read({ author_id: id });
      if (docs.length === 0) {
        res.status(404).send(`No documents were found for user with ID ${id}. If the ID is valid, that means this user created no documents.`);
        return;
      }
      res.status(200).send(docs);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** updates user's data and sends 200 OK status with updated data if successfuly fetched
   * @param {Object} req - request object, expected properties:
   *  params.id, body.email, body.fullname, body.username, body.password
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
  updateUser = async (req, res, next) => {
    const {
      email,
      fullname,
      username,
      password
    } = req.body;
    const { id } = req.params;
    try {
      if (!email && !fullname && !username && !password) {
        res.status(400).send('You have to supply data to update.');
        return;
      }
      if (!id) {
        res.status(400).send('You have to supply an ID of the user to update.');
        return;
      }
      const user = await this.findUser(req, res, next, { profileId: id });
      if (user === null) {
        res.status(404).send('User not found');
        return;
      }
      let { userProfile, userLogin } = user;
      if (email || fullname) {
        userProfile = await this.userProfiles.update({ id }, { email, fullname });
      }
      if (username || password) {
        userLogin = await this.userLogins.update({ user_profile_id: id }, { username, password });
      }
      const userData = {
        username: userLogin[0].username,
        email: userProfile[0].email,
        fullname: userProfile[0].fullname,
        id: userProfile[0].id
      };
      res.status(200).send(userData);
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }

  /** updates deleted_at column of a given user in the database and sends 200 OK status
   *  with a success message if successfuly updated
   * @param {Object} req - request object, expected properties: params.id
   * @param {Object} res - response object
   * @param {Function} next - passes errors to next Express middleware
   * @returns {undefined}.
   */
  deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
      // if user doesn't exist, send 400 Bad Request status
      const user = await this.findUser(req, res, next, { profileId: id });
      if (user === null) {
        res.status(404).send('User not found');
        return;
      }
      await this.userProfiles.update({ id }, { deleted_at: new Date(Date.now()).toUTCString() });
      res.status(200).send('User deleted');
    } catch (err) {
      if (res.headersSent) {
        next(err);
      } else {
        generic(err, req, res);
      }
    }
  }
}

export default new UsersService();
