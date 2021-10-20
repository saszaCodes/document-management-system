import { knex as db } from '../lib';
import CRUD from './CRUD';

/** contains methods for CRUD operations in user_profiles table */
class UserProfiles extends CRUD {
  constructor() {
    super('user_profiles');
  }

  create(data) {
    return db(this.table).insert(data, '*');
  }

  read(conditions) {
    return db(this.table).where(conditions);
  }

  update(conditions, data) {
    return db(this.table)
      .where(conditions)
      .update(data, '*');
  }
}

export default UserProfiles;
