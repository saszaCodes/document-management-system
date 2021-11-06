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
   * @param {Object} conditions restricting the results
   * @param {Number} limit (optional) limits number of results
   * @param {Number} offset (optional) offsets results
   * @returns {Promise} representing read operation
   */
  read(conditions, limit, offset) {
    return db(this.table)
      .select(...this.returnColumns)
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

export default Documents;
