import { user } from '../models';

export const dmsService = {
  fetchAllUsers: async (req, res) => {
    let users;
    try {
      users = await user.getAllUsers();
    } catch (err) {
      console.log('an error occured when calling fetchAllUsers() method:');
      console.log(err);
      res.status(500).send();
      return;
    }
    res.status(200).send(users);
  }
};
