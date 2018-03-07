
const TABLE_NAME = 'activities'
exports.up = function (knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.string('headline');
    table.string('address');
    table.specificType('position', 'point');
    table.text('description');
    table.integer('status_id').unsigned();
    table.foreign('status_id').references('statuses.id')
    table.timestamps();
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
