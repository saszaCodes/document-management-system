/* eslint-disable max-classes-per-file */
/* eslint-disable require-jsdoc */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import { knex as db } from '../lib';

class CRUD {
  constructor(table) {
    this.table = table;
  }
  async createEntry(data, returnColumns) {
    const entry = await db(this.table)
      .insert(data, returnColumns)
      .catch((err) => { throw err; });
    return entry;
  }
  async getAll(columns) {
    const data = await db
      .select(...columns)
      .from(this.table)
      .catch((err) => { throw err; });
    return data;
  }
  // TODO: should allow multiple conditions, not only key-value. Update name afted changing
  async getEntry(conditions, columns) {
    const data = await db
      .select(...columns)
      .where(conditions)
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
/** contains methods for CRUD operations in user_profiles table */
class UserProfilesClass extends CRUD {
  addProfile(email, fullname) {
    if (!email) {
      throw new Error('email is required in function addUser()');
    }
    return this.createEntry({ email, fullname }, ['id', 'email', 'fullname']);
  }
  getAllProfiles() {
    return this.getAll(['id', 'email', 'fullname']);
  }
  getProfileById(id) {
    return this.getEntry({ id }, ['id', 'email', 'fullname']);
  }
  getProfileByEmail(email) {
    return this.getEntry({ email }, ['id', 'email', 'fullname']);
  }
  updateProfile(id, updateValues) {
    return this.updateEntry({ id }, updateValues, ['id', 'email', 'fullname']);
  }
  deleteProfile(id) {
    return this.deleteEntry({ id });
  }
}

export const userProfiles = new UserProfilesClass('user_profiles');
