const constants = require('../consts')

exports.up = function(knex) {
  return knex.schema.createTable(constants.categories, function (table)
  {
      table.increments(constants.id).unsigned().primary();
      table.string(constants.name);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable(constants.categories);
};
