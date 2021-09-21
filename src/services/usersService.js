import { userProfiles, userLogins } from '../models';

export const usersService = {
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
  },
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
