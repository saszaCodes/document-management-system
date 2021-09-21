import CRUD from './CRUD';

/** contains methods for CRUD operations in user_logins table */
class UserLogins extends CRUD {
  /** creates new document
   * @param {String} userId (required) - has to match an existing entry in 'user_profiles' table
   * (user_profile_id is a remote key in documents table, referencing id in user_profiles)
   * @returns {Promise} which resolves with an empty Array
   */
  addLogin(userId) {
    if (!userId) {
      throw new Error('title is required in function addLogin()');
    }
    return this.createEntry({ user_profile_id: userId }, []);
  }

  /** updates last_login column in a matching entry to a current timestamp
   * @param {Number} userId (required)
   * @param {String} timestamp (required) - a string representing date in a format
   * accepted by PostgreSQL as datetime type
   * @returns {Promise} which resolves with an empty Array
  */
  logIn(userId, timestamp) {
    return this.updateEntry({ user_profile_id: userId }, { last_login: timestamp });
  }
}

export const userLogins = new UserLogins('user_logins');
