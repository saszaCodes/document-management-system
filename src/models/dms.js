/* eslint-disable max-classes-per-file */
/* eslint-disable lines-between-class-members */
import { knex as db } from '../lib';

/** CRUD class contains template CRUD methods */
class CRUD {
  /** @param {String} table - name of the table in db that you want to access */
  constructor(table) {
    this.table = table;
  }
  /** checks if entry exists in the db
   * @param {Object} conditions - set of conditions that the function checks against.
   * Object keys match column names and values match values in the respective column
   * @param {String} customTable (optional) - name of a different table
   * than the one provided to constructor function
   * @returns {boolean} (true if exists, false if not)
   */
  async checkIfEntryExists(conditions, customTable) {
    const table = customTable || this.table;
    const entry = await db
      .select()
      .where(conditions)
      .from(table)
      .catch((err) => { throw err; });
    if (entry.length === 0) {
      return false;
    }
    if (entry[0].deleted_at) {
      return false;
    }
    return true;
  }
  /** creates new entry in db
   * @param {Object} data - data you want to insert. Object keys match column names,
   * object values match values in the respective column
   * @param {Array} returnColumns - array of strings - names of columns that the query is to return
   * @returns {Array} - array of strings, as defined in returnColumns param;
   */
  async createEntry(data, returnColumns) {
    const entry = await db(this.table)
      .insert(data, returnColumns)
      .catch((err) => { throw err; });
    return entry;
  }
  /** retrieves entry (entries) from the db
   * @param {Object} conditions - set of conditions that the function checks the entries to retrieve
   * against. Object keys match column names and values match values in the respective column.
   * @param {Array} columns - array of strings - list of columns to be returned from the query
   * @returns {Array} - array of strings, as defined in columns param
   */
  async getEntry(conditions, columns) {
    const data = await db
      .select(...columns)
      .where(conditions)
      .from(this.table)
      .catch((err) => { throw err; });
    return data;
  }
  /** updates entry in the db
   * @param {Object} conditions - set of conditions that the function checks the entries to update
   * against. Object keys match column names and values match values in the respective column.
   * @param {Object} updateValues - columns to be updated in each entry matching the conditions.
   * Object keys match column names and values match values in the respective column.
   * @param {Array} returnColumns - array of strings - names of columns that the query is to return
   * @returns {Array} - array of strings, as defined in returnColumns param;
  */
  async updateEntry(conditions, updateValues, returnColumns) {
    let updatedColumns;
    if (conditions) {
      updatedColumns = await db(this.table)
        .update(updateValues, returnColumns)
        .where(conditions)
        .catch((err) => { throw err; });
    } else {
      updatedColumns = await db(this.table)
        .update(updateValues, returnColumns)
        .catch((err) => { throw err; });
    }
    return updatedColumns;
  }
  /** permanently deletes entry from the db
   * @param {Object} conditions - set of conditions that the function checks the entries against.
   * Object keys match column names and values match values in the respective column.
   * @returns {Array} - an empty array.
   */
  async deleteEntry(conditions) {
    db(this.table)
      .where(conditions)
      .del()
      .catch((err) => { throw err; });
  }
}
/** contains methods for CRUD operations in user_profiles table */
class UserProfilesClass extends CRUD {
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

/** contains methods for CRUD operations in documents table */
class DocumentsClass extends CRUD {
  /** checks if document matching the conditions exists
   * @param {Object} conditions - set of conditions that the function checks the entries against.
   * Object keys match column names and values match values in the respective column.
   * @returns {Promise} which resolves with a boolean (true if document exists, false otherwise)
  */
  checkIfDocumentExists(conditions) {
    return this.checkIfEntryExists(conditions);
  }
  /** creates new document
   * @param {String} title (required)
   * @param {String} body (optional)
   * @param {String} authorId (required) - has to match an existing entry in 'user_profiles' table
   * (author_id is a remote key in documents table, referencing id in user_profiles)
   * @returns {Promise} which resolves with an Array containing
   * an Object with new documents's id, title, body and author_id
   */
  addDocument(title, body, authorId) {
    if (!title || !authorId) {
      throw new Error('title and authorId are required in function addDocument()');
    }
    return this.createEntry({ title, body, author_id: authorId }, ['id', 'title', 'body', 'author_id']);
  }
  /** fetches document with matching id
   * @param {Number} id
   * @returns {Promise} which resolves with an Array containing
   * an Object with documents's id, title, body and author_id,
   * or an emptry Array if no entry is found.
   */
  getDocumentById(id) {
    return this.getEntry({ id }, ['id', 'title', 'body', 'author_id']);
  }
  /** fetches documents with matching title
   * @param {String} title
   * @returns {Promise} which resolves with an Array containing
   * Objects with documents' id, title, body and author_id,
   * or an emptry Array if no entry is found.
   */
  getDocumentsByTitle(title) {
    return this.getEntry({ title }, ['id', 'title', 'body', 'author_id']);
  }
  /** updates profile's details
   * @param {Number} id - id of the profile to update
   * @param {Object} updateValues - columns to be updated in the entry with matching id.
   * Object keys match column names and values match values in the respective column.
   * @returns {Promise} which resolves with an Array containing updated profile's
   * details: id, email, fullname and username
   */
  updateDocument(id, updateValues) {
    return this.updateEntry({ id }, updateValues, ['id', 'title', 'body', 'author_id']);
  }
}

/** contains methods for CRUD operations in user_logins table */
class UserLoginsClass extends CRUD {
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

export const userProfiles = new UserProfilesClass('user_profiles');
export const documents = new DocumentsClass('documents');
export const userLogins = new UserLoginsClass('user_logins');
