const {
  KNEX_CLIENT,
  DB_URL,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = process.env;

export default {
  client: KNEX_CLIENT,
  connection: {
    host: DB_URL,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};
