/* eslint-disable require-jsdoc */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import { knex as db } from '../lib';

class CRUD {
  constructor(table) {
    this.table = table;
  }
  async createEntry(data) {
    await db(this.table)
      .insert(data)
      .catch((err) => { throw err; });
  }
  async getAll(columns) {
    const data = await db
      .select(...columns)
      .from(this.table)
      .catch((err) => { throw err; });
    return data;
  }
  // TODO: should allow multiple conditions, not only key-value. Update name afted changing
  async getByKey(key, value, columns) {
    const data = await db
      .select(...columns)
      .where(key, value)
      .from(this.table)
      .catch((err) => { throw err; });
    return data;
  }
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
  async deleteEntry(conditions) {
    db(this.table)
      .where(conditions)
      .del()
      .catch((err) => { throw err; });
  }
}

/** contains methods responsible for CRUD operations in users table */
const user = new CRUD('user_profiles');

export { user };
