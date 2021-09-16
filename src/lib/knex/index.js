import knexFunc from 'knex';

const knex = knexFunc({
  client: 'pg',
  connection: {
    host: 'postgres://jlzyjhwx:bggtp4pTzPH3eZHG6L4KbO5HTRZJaf3v@ella.db.elephantsql.com/jlzyjhwx',
    user: 'jlzyjhwx',
    password: 'bggtp4pTzPH3eZHG6L4KbO5HTRZJaf3v',
    database: 'jlzyjhwx'
  }
});

export default knex;
