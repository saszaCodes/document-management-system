/* eslint-disable brace-style */
import { userProfiles, documents, userLogins } from '../models';

export const userProfilesService = {
  createProfile: async (req, res, next) => {
    const {
      email,
      fullname,
      username,
      password
    } = req.body;
    // email is required, if it is not supplied, send 400 Bad Request status
    if (!email || !password || !username) {
      res.status(400).send('Invalid request. New user\'s email needs to be supplied');
      return;
    }
    // emails need to be unique, if profile with supplied email already exists,
    // send 400 Bad Request status
    const emailExists = await userProfiles
      .checkIfProfileExists({ email })
      .catch((err) => { next(err); });
    if (emailExists) {
      res.status(400).send('Email already used.');
      return;
    }
    // usernames need to be unique, if profile with supplied email already exists,
    // send 400 Bad Request status
    const usernameExists = await userProfiles
      .checkIfProfileExists({ username })
      .catch((err) => { next(err); });
    if (usernameExists) {
      res.status(400).send('Username already used.');
      return;
    }
    // if user is successfully created, send their email, fullname and id
    const profile = await userProfiles
      .addProfile(email, fullname, username, password)
      .catch((err) => { next(err); });
    res.status(200).send(profile);
  },
  fetchActiveProfiles: async (req, res, next) => {
    const profiles = await userProfiles
      .getActiveProfiles()
      .catch((err) => { next(err); });
    res.status(200).send(profiles);
  },
  fetchProfile: async (req, res, next) => {
    // if profile doesn't exist, send 404
    const { id } = req.params;
    const profileExists = await userProfiles
      .checkIfProfileExists({ id })
      .catch((err) => { next(err); });
    if (!profileExists) {
      res.status(404).send('Profile not found.');
      return;
    }
    // else, send 200 with profile data
    const profile = await userProfiles
      .getProfileById(id)
      .catch((err) => { next(err); });
    res.status(200).send(profile);
  },
  updateProfile: async (req, res, next) => {
    const {
      email,
      fullname,
      username,
      password
    } = req.body;
    const { id } = req.params;
    // if no update values are supplied in request, send 400 Bad Request status
    if (!email && !fullname && !username && !password) {
      res.status(400).send('Invalid request');
      return;
    }
    // if profile doesn't exist, send 404 Not Found status
    const profileExists = await userProfiles
      .checkIfProfileExists({ id })
      .catch((err) => { next(err); });
    if (!profileExists) {
      res.status(404).send('Profile doesn\'t exist.');
      return;
    }
    // if user tries to change email to one that is already used, send 400 Bad Request status
    if (email) {
      const existingUser = await userProfiles
        .checkIfProfileExists({ email })
        .catch((err) => { next(err); });
      if (existingUser) {
        res.status(400).send('This email is already registered.');
        return;
      }
    }
    // if user tries to change username to one that is already used, send 400 Bad Request status
    if (username) {
      const existingUser = await userProfiles
        .checkIfProfileExists({ username })
        .catch((err) => { next(err); });
      if (existingUser) {
        res.status(400).send('This username is already registered.');
        return;
      }
    }
    const updatedColumns = await userProfiles
      .updateProfile(id, {
        email,
        fullname,
        username,
        password
      })
      .catch((err) => { next(err); });
    res.status(200).send(updatedColumns);
  },
  deleteProfile: async (req, res, next) => {
    const { id } = req.params;
    // if user doesn't exist, send 400 Bad Request status
    const profileExists = await userProfiles
      .checkIfProfileExists({ id })
      .catch((err) => { next(err); });
    if (!profileExists) {
      res.status(400).send('User doesn\'t exist.');
      return;
    }
    await userProfiles
      .updateProfile(id, { deleted_at: new Date(Date.now()).toUTCString() })
      .catch((err) => { next(err); });
    res.status(200).send('User successfully deleted.');
  }
};

export const documentsService = {
  createDocument: async (req, res, next) => {
    const { title, body } = req.body;
    // title is required, if it is not supplied, send 400 Bad Request status
    if (!title) {
      res.status(400).send('Invalid request. Title needs to be supplied');
      return;
    }
    // if document is successfully created, send its id, title and body
    const doc = await documents
      .addDocument(title, body)
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

export const userLoginsService = {
  createLogin: async (req, res, next) => {
    const { username, password } = req.body;
    // username and password are required, if they are not supplied,
    // send 400 Bad Request status
    if (!username || !password) {
      res.status(400).send('Invalid request. Username and password need to be supplied');
      return;
    }
    // if login is successfully created, send its id and username
    const login = await userLogins
      .addLogin(username, password)
      .catch((err) => { next(err); });
    res.status(200).send(login);
  },
  updateLogin: async (req, res, next) => {
    const { updateValues } = req.body;
    // if no update values are supplied in request, or their type is other than object
    // return 400 Bad Request status
    if (!updateValues || typeof updateValues !== 'object') {
      res.status(400).send('Invalid request');
      return;
    }
    const updateKeys = Object.keys(updateValues);
    // if any other update values than 'username' or 'password' are supplied in request,
    // return 400 Bad Request status
    if (updateKeys.some((el) => el !== 'username' && el !== 'password')) {
      res.status(400).send('Invalid request');
      return;
    }
    const updatedColumns = await userLogins
      .updateLogin(req.params.id, updateValues)
      .catch((err) => { next(err); });
    res.status(200).send(updatedColumns);
  },
  deleteLogin: async (req, res, next) => {
    const { id } = req.params;
    // if login doesn't exist, send 400 Bad Request status
    const login = await userLogins
      .getLoginById(id)
      .catch((err) => { next(err); });
    if (login.length === 0) {
      res.status(400).send(`Login with id ${id} doesn't exist.`);
      return;
    }
    await userLogins
      .deleteLogin(id)
      .catch((err) => { next(err); });
    res.status(200).send('Login successfully deleted.');
  }
};
