/* eslint-disable brace-style */
import { userProfiles, documents } from '../models';

export const userProfilesService = {
  createUser: async (req, res, next) => {
    const { email, fullname } = req.body;
    // email is required, if it is not supplied, send 400 Bad Request status
    if (!email) {
      res.status(400).send('Invalid request. New user\'s email needs to be supplied');
      return;
    }
    // emails need to be unique, if user with supplied email already exists,
    // send 400 Bad Request status
    const existingUser = await userProfiles
      .getProfileByEmail(email)
      .catch((err) => { next(err); });
    if (existingUser.length > 0) {
      res.status(400).send('Email already registered.');
      return;
    }
    // if user is successfully created, send their email, fullname and id
    const profile = await userProfiles
      .addProfile(email, fullname)
      .catch((err) => { next(err); });
    res.status(200).send(profile);
  },
  fetchAllProfiles: async (req, res, next) => {
    const profiles = await userProfiles
      .getAllProfiles()
      .catch((err) => { next(err); });
    res.status(200).send(profiles);
  },
  fetchProfile: async (req, res, next) => {
    const profile = await userProfiles
      .getProfileById(req.params.id)
      .catch((err) => { next(err); });
    if (profile.length === 0) { res.status(404).send('Profile not found.'); }
    else { res.status(200).send(profile); }
  },
  updateProfile: async (req, res, next) => {
    const { updateValues } = req.body;
    // if no update values are supplied in request, or their type is other than object
    // return 400 Bad Request status
    if (!updateValues || typeof updateValues !== 'object') {
      res.status(400).send('Invalid request');
      return;
    }
    const updateKeys = Object.keys(updateValues);
    // if any other update values than 'email' or 'fullname' are supplied in request,
    // return 400 Bad Request status
    if (updateKeys.some((el) => el !== 'email' && el !== 'fullname')) {
      res.status(400).send('Invalid request');
      return;
    }
    // if user tries to change email to one that is already used, send 400 Bad Request status
    if (updateValues.email) {
      const existingUser = await userProfiles
        .getProfileByEmail(updateValues.email)
        .catch((err) => { next(err); });
      if (existingUser.length > 0) {
        res.status(400).send('This email is already registered.');
        return;
      }
    }
    const updatedColumns = await userProfiles
      .updateProfile(req.params.id, updateValues)
      .catch((err) => { next(err); });
    res.status(200).send(updatedColumns);
  },
  deleteProfile: async (req, res, next) => {
    const { id } = req.params;
    // if user doesn't exist, send 400 Bad Request status
    const userProfile = await userProfiles
      .getProfileById(id)
      .catch((err) => { next(err); });
    if (userProfile.length === 0) {
      res.status(400).send(`User with id ${id} doesn't exist.`);
      return;
    }
    await userProfiles
      .deleteProfile(id)
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
    const doc = await documents
      .getDocumentById(req.params.id)
      .catch((err) => { next(err); });
    if (doc.length === 0) { res.status(404).send('Document not found.'); }
    else { res.status(200).send(doc); }
  },
  updateDocument: async (req, res, next) => {
    const { updateValues } = req.body;
    // if no update values are supplied in request, or their type is other than object
    // return 400 Bad Request status
    if (!updateValues || typeof updateValues !== 'object') {
      res.status(400).send('Invalid request');
      return;
    }
    const updateKeys = Object.keys(updateValues);
    // if any other update values than 'title' or 'body' are supplied in request,
    // return 400 Bad Request status
    if (updateKeys.some((el) => el !== 'title' && el !== 'body')) {
      res.status(400).send('Invalid request');
      return;
    }
    const updatedColumns = await documents
      .updateDocument(req.params.id, updateValues)
      .catch((err) => { next(err); });
    res.status(200).send(updatedColumns);
  },
  deleteDocument: async (req, res, next) => {
    const { id } = req.params;
    // if document doesn't exist, send 400 Bad Request status
    const doc = await documents
      .getDocumentById(id)
      .catch((err) => { next(err); });
    if (doc.length === 0) {
      res.status(400).send(`Document with id ${id} doesn't exist.`);
      return;
    }
    await userProfiles
      .deleteDocument(id)
      .catch((err) => { next(err); });
    res.status(200).send('Document successfully deleted.');
  }
};
