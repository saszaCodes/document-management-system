import { logger } from '../../lib';

/** function handling all non-specific errors. It creates an error with a generic message and passes
 * passes it to Express error handler using next() function (to handle asynchronous errors, which
 * wouldn't happen if the function just threw the error).
 * @param {Error} err is expected to be an Error object
 * @param {Object} req is expected to be an an object with info about the request
 * @param {Object} res is expected to be an an object with info about the response
 * @returns {null}.
 */
function generic(err, req, res) {
  logger.error(err.stack);
  res.sendStatus(500);
}

export default generic;
