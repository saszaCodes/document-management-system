/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import { knex as db } from '../lib';

/** contains methods responsible for CRUD operations in users table */
const user = {
  getAllUsers: async () => {
    let users;
    try {
      users = await db.select('username', 'password').from('users');
    } catch (err) {
      throw err;
    }
    return users;
  }
};

export { user };
