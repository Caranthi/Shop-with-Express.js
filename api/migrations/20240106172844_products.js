const constants = require("../consts");

exports.up = function(knex) {
    return knex.schema.createTable(constants.products, (table) =>
    {
        table.increments(constants.id).unsigned().primary();
        table.string(constants.name);
        table.string(constants.description);
        table.float(constants.price);
        table.float(constants.weight);
        table.integer(constants.category);
        table.foreign(constants.category).references(constants.id).inTable(constants.categories);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(constants.products);
};
