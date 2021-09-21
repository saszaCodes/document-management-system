import { knex as db } from '../lib';

/** CRUD class contains template CRUD methods */
export default class CRUD {
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
