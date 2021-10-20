/* eslint-disable require-jsdoc */
import { knex as db } from '../lib';
import CRUD from './CRUD';

/** contains methods for CRUD operations in user_logins table */
class UserLogins extends CRUD {
  constructor() {
    super('user_logins');
  }

  create(data) {
    return db(this.table)
      .insert(data, ['id', 'username', 'user_profile_id', 'last_login']);
  }

  read(conditions) {
    return db(this.table).where(conditions);
  }

  update(conditions, data) {
    return db(this.table)
      .where(conditions)
      .update(data, ['id', 'username', 'user_profile_id', 'last_login']);
  }
}

export default UserLogins;
