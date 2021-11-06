import { knex as db } from '../lib';
import CRUD from './CRUD';

/** contains methods for CRUD operations in documents table */
class Documents extends CRUD {
  /** calls parent class constructor, which sets this.table */
  constructor() {
    super('documents');
    this.returnColumns = ['id', 'author_id', 'title', 'body'];
  }

  /** creates new entry in the database
   * @param {Object} data contains data to be entered
   * @returns {Promise} representing entry operation
   */
  create(data) {
    return db(this.table).insert(data, this.returnColumns);
  }

  /** reads existing entry from the database
   * @param {Object} conditionsObj object with key/value pairs restricting the results
   * @param {Array} conditionsArr array of strings, which form a condition
   * @param {Number} limit (optional) limits number of results
   * @param {Number} offset (optional) offsets results
   * @returns {Promise} representing read operation
   */
  read(conditionsObj, conditionsArr, limit, offset) {
    let conditions;
    if (conditionsObj) {
      // put conditionsObj inside and array to make sure
      // the spread operator in where() works as expected
      conditions = [conditionsObj];
    } else {
      conditions = conditionsArr;
    }
    return db(this.table)
      .select(...this.returnColumns)
      .where(conditions)
      .andWhere({ deleted_at: null })
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

export default Documents;
