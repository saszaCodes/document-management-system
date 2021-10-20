/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */

/** CRUD class contains template CRUD methods */
export default class CRUD {
  constructor(table) {
    this.table = table;
  }

  create() { throw new Error('Abstract method. You have to implement it in a child class'); }

  read() { throw new Error('Abstract method. You have to implement it in a child class'); }

  update() { throw new Error('Abstract method. You have to implement it in a child class'); }

  delete() { throw new Error('Abstract method. You have to implement it in a child class'); }
}
