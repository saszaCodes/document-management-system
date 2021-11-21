import bcrypt from 'bcrypt';

/** contains static methods for password hashing and comparing plain text password with a hash */
class Bcrypt {
  /** Asynchronous function hashing given plain text password
   * @param {String} plainTextPassword String containing plain text password
   * @returns {Promise} A promise which is resolved with the hashed password
   */
  static async hashPwd(plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
  }

  /** Asynchronous function comparing given plain text password with given hash
   * @param {String} plainTextPassword String containing plain text password
   * @param {String} hash String containing hash
   * @returns {Promise} A promise which resolves with a boolean
   */
  static async comparePwd(plainTextPassword, hash) {
    return bcrypt.compare(plainTextPassword, hash);
  }
}

export default Bcrypt;
