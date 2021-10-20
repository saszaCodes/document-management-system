export function up(knex) {
  return knex.schema
    .createTable('user_logins', (table) => {
      table.increments('id');
      table.string('username').notNullable();
      table.string('password').notNullable();
      table.integer('user_profile_id').notNullable().references('id').inTable('user_profiles');
      table.date('last_login');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('user_logins');
}
