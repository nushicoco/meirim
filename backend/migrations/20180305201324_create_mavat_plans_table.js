
const TABLE_NAME = 'mavat_plans'
exports.up = function (knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.enu('status', ['new', 'updated', 'sent']);
    table.string('name').notNullable();
    // Status represents the state of the plan, depending when it was sent or updated
    table.string('object_id').notNullable();
    table.string('county_name').notNullable();
    table.string('pl_number').notNullable();
    table.string('pl_name').notNullable();
    table.text('data').notNullable();
    table.text('url').notNullable();
    table.text('goals').notNullable();
    table.text('main_details').notNullable();
    table.specificType('geom', 'geometry').notNullable();
    table.timestamps();
  }).then(() => knex.schema.alterTable('mavat_plans', function (table) {
    table.unique('object_id')
  }))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
