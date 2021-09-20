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
    // email, username and password are required,
    // if they are not supplied, send 400 Bad Request status
    if (!email || !password || !username) {
      res.status(400).send('Invalid request. New user\'s email, username and password need to be supplied');
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
    // create entry in user_profiles table;
    const profile = await userProfiles
      .addProfile(email, fullname, username, password)
      .catch((err) => { next(err); });
    // create entry in user_logins table
    const profileId = profile[0].id;
    await userLogins
      .addLogin(profileId)
      .catch((err) => { next(err); });
    // if user is successfully created, send their email, fullname and id
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

export const userLoginsService = {
  logIn: async (req, res, next) => {
    const { username, password } = req.body;
    // username and password are required,
    // if they are not supplied, send 400 Bad Request status
    if (!password || !username) {
      res.status(400).send('Invalid request. Username and password are required.');
      return;
    }
    // check if username and password match any user in user_profiles table
    // if not, send 400 status
    const userExists = await userProfiles
      .checkIfProfileExists({ username, password })
      .catch((err) => { next(err); });
    if (!userExists) {
      res.status(400).send('Authentication failed');
      return;
    }
    // get id of a user with supplied username
    const userData = await userProfiles
      .getProfileByUsername(username)
      .catch((err) => { next(err); });
    const userId = userData[0].id;
    // update last_login column in user_logins table
    await userLogins
      .logIn(userId, new Date(Date.now()).toUTCString())
      .catch((err) => { next(err); });
    res.status(200).send('Authentication successful');
  }
};
