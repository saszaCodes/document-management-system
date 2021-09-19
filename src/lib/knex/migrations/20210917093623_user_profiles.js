export function up(knex) {
  return knex.schema
    .createTable('user_profiles', (table) => {
      table.increments('id');
      table.string('email').notNullable().unique();
      table.string('fullname');
      table.timestamps(true, true);
      table.date('deleted_at');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('user_profiles');
}
