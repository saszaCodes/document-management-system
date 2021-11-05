import { knex as db } from '../lib';
import CRUD from './CRUD';

/** contains methods for CRUD operations in user_profiles table */
class UserProfiles extends CRUD {
  /** calls parent class constructor, which sets this.table */
  constructor() {
    super('user_profiles');
    this.returnColumns = ['id', 'email', 'fullname'];
  }

  /** creates new entry in the database
   * @param {Object} data contains data to be entered
   * @returns {Promise} representing entry operation
   */
  create(data) {
    return db(this.table).insert(data, this.returnColumns);
  }

  /** reads existing entry from the database
   * @param {Object} conditions restricting the results
   * @param {Number} limit (optional) limits number of results
   * @param {Number} offset (optional) offsets results
   * @returns {Promise} representing read operation
   */
  read(conditions, limit, offset) {
    return db(this.table)
      .where(conditions, this.returnColumns)
      .limit(limit)
      .offset(offset);
  }

  /** reads existing entry from the database
   * @param {Object} conditions restricting the results
   * @param {Number} limit (optional) limits number of results
   * @param {Number} offset (optional) offsets results
   * @returns {Promise} representing read operation
   */
  readWithLogins(conditions, limit, offset) {
    return db(this.table)
      .join('user_logins', 'user_profiles.id', '=', 'user_logins.user_profile_id')
      .select(
        'user_profiles.id',
        'user_profiles.email',
        'user_profiles.fullname',
        'user_logins.username'
      )
      .where(conditions)
      .limit(limit)
      .offset(offset);
  }

  /** udpates entry in the database
   * @param {Object} conditions restricting rows to be updated
   * @param {Object} data contains new data to be entered
   * @returns {Promise} representing update operation
   */
  update(conditions, data) {
    return db(this.table)
      .where(conditions)
      .update(data, this.returnColumns);
  }
}

export default UserProfiles;
