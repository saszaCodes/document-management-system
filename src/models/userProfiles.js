import CRUD from './CRUD';

/** contains methods for CRUD operations in user_profiles table */
class UserProfiles extends CRUD {
  /** checks if profile matching the conditions exists in the table given to constructor
   * @param {Object} conditions - set of conditions that the function checks the entries against.
   * Object keys match column names and values match values in the respective column.
   * @returns {Promise} which resolves with a boolean (true if profile exists, false otherwise)
  */
  checkIfProfileExists(conditions) {
    return this.checkIfEntryExists(conditions);
  }

  /** creates new profile
   * @param {String} email (required)
   * @param {String} fullname (optional)
   * @param {String} username (required)
   * @param {String} password (required)
   * @returns {Promise} which resolves with an Array containing
   * an Object with new user's id, email, fullname and username
   */
  addProfile(email, fullname, username, password) {
    if (!email || !username || !password) {
      throw new Error('email, username and password are required in function addUser()');
    }
    return this.createEntry({
      email,
      fullname,
      username,
      password
    }, ['id', 'email', 'fullname', 'username']);
  }

  /** fetches all profiles with value null in column 'deleted_at'.
   * @returns {Promise} which resolves with an Array containing
   * Objects with profiles' details: id, email, fullname and username
   */
  getActiveProfiles() {
    return this.getEntry({ deleted_at: null }, ['id', 'email', 'fullname', 'username']);
  }

  /** fetches profile with matching id
   * @param {Number} id
   * @returns {Promise} which resolves with an Array containing
   * an Object with profile's details: id, email, fullname and username,
   * or an emptry Array if no entry is found.
   */
  getProfileById(id) {
    return this.getEntry({ id }, ['id', 'email', 'fullname', 'username']);
  }

  /** fetches profile with matching username
   * @param {String} username
   * @returns {Promise} which resolves with an Array containing
   * an Object with profile's details: id, email, fullname and username,
   * or an emptry Array if no entry is found.
   */
  getProfileByUsername(username) {
    return this.getEntry({ username }, ['id', 'email', 'fullname', 'username']);
  }

  /** updates profile's details
   * @param {Number} id - id of the profile to update
   * @param {Object} updateValues - columns to be updated in each entry with the matching id.
   * Object keys match column names and values match values in the respective column.
   * @returns {Promise} which resolves with an Array containing updated profile's
   * details: id, email, fullname and username
   */
  updateProfile(id, updateValues) {
    return this.updateEntry({ id }, updateValues, ['id', 'email', 'fullname', 'username']);
  }
}

export const userProfiles = UserProfiles('user_profiles');
