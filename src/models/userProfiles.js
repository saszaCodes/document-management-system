import { knex as db } from '../lib';
import CRUD from './CRUD';

/** contains methods for CRUD operations in user_profiles table */
class UserProfiles extends CRUD {
  /** calls parent class constructor, which sets this.table */
  constructor() {
    super('user_profiles');
  }

  /** creates new entry in the database
   * @param {Object} data contains data to be entered
   * @returns {Promise} representing entry operation
   */
  create(data) {
    return db(this.table).insert(data, '*');
  }

  /** reads existing entry from the database
   * @param {Object} conditions restricting the results
   * @returns {Promise} representing read operation
   */
  read(conditions) {
    return db(this.table).where(conditions);
  }

  /** udpates entry in the database
   * @param {Object} conditions restricting rows to be updated
   * @param {Object} data contains new data to be entered
   * @returns {Promise} representing update operation
   */
  update(conditions, data) {
    return db(this.table)
      .where(conditions)
      .update(data, '*');
  }
}

export default UserProfiles;
