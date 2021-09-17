export function up(knex) {
  return knex.schema
    .createTable('documents', (table) => {
      table.increments('id');
      table.string('title').notNullable();
      table.text('body');
      table.integer('author_id').notNullable().references('id').inTable('user_profiles');
      table.timestamps(true, true);
      table.date('deleted_at');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('documents');
}
