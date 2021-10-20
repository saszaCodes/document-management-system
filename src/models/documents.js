/* eslint-disable require-jsdoc */
import { knex as db } from '../lib';
import CRUD from './CRUD';

/** contains methods for CRUD operations in documents table */
class Documents extends CRUD {
  constructor() {
    super('documents');
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

export default Documents;
