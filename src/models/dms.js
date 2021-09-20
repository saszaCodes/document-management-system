/* eslint-disable max-classes-per-file */
/* eslint-disable require-jsdoc */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import { knex as db } from '../lib';

class CRUD {
  constructor(table) {
    this.table = table;
  }
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
  checkIfProfileExists(conditions) {
    return this.checkIfEntryExists(conditions);
  }
  addProfile(email, fullname) {
    if (!email) {
      throw new Error('email is required in function addUser()');
    }
    return this.createEntry({ email, fullname }, ['id', 'email', 'fullname', 'username']);
  }
  getActiveProfiles() {
    return this.getEntry({ deleted_at: null }, ['id', 'email', 'fullname', 'username']);
  }
  getProfileById(id) {
    return this.getEntry({ id }, ['id', 'email', 'fullname', 'username']);
  }
  updateProfile(id, updateValues) {
    return this.updateEntry({ id }, updateValues, ['id', 'email', 'fullname', 'username']);
  }
}

class DocumentsClass extends CRUD {
  checkIfDocumentExists(conditions) {
    return this.checkIfEntryExists(conditions);
  }
  addDocument(title, body) {
    if (!title) {
      throw new Error('title is required in function addDocument()');
    }
    return this.createEntry({ title, body }, ['id', 'title', 'body', 'author_id']);
  }
  getDocumentById(id) {
    return this.getEntry({ id }, ['id', 'title', 'body', 'author_id']);
  }
  getDocumentsByTitle(title) {
    return this.getEntry({ title }, ['id', 'title', 'body', 'author_id']);
  }
  updateDocument(id, updateValues) {
    return this.updateEntry({ id }, updateValues, ['id', 'title', 'body', 'author_id']);
  }
  deleteDocument(id) {
    return this.deleteEntry({ id });
  }
}

class UserLoginsClass extends CRUD {
  addLogin(username, password) {
    if (!username || !password) {
      throw new Error('username and password are required in function addLogin()');
    }
    return this.createEntry({ username, password }, ['id', 'username']);
  }
  getLoginById(id) {
    return this.getEntry({ id }, ['id', 'username']);
  }
  updateLogin(id, updateValues) {
    return this.updateEntry({ id }, updateValues, ['id', 'username']);
  }
  deleteLogin(id) {
    return this.deleteEntry({ id });
  }
  async checkCredentials(username, password) {
    const credentials = await this.getEntry({ username, password }, ['username'])
      .catch((err) => { throw err; });
    return credentials.length > 0;
  }
}

export const userProfiles = new UserProfilesClass('user_profiles');
export const documents = new DocumentsClass('documents');
export const userLogins = new UserLoginsClass('user_logins');
