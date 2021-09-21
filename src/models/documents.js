import CRUD from './CRUD';

/** contains methods for CRUD operations in documents table */
class Documents extends CRUD {
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

export const documents = new Documents('documents');
