import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  test('responds with status 200', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
