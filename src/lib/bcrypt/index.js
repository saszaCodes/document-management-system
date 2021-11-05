/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';

class Bcrypt {
  async hashPwd(plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
  }

  async comparePwd(plainTextPassword, hash) {
    return bcrypt.compare(plainTextPassword, hash);
  }
}

export default new Bcrypt();
