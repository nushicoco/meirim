
const TAGS_TABLE_NAME = 'tags';
exports.up = function (knex, Promise) {
  return knex.schema.createTable(TAGS_TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps();
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable(TAGS_TABLE_NAME);
};
