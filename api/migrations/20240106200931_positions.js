const constants = require("../consts");

exports.up = function(knex) {
    return knex.schema.createTable(constants.positions, (table) =>
    {
        table.increments(constants.id).unsigned().primary();
        table.integer(constants.order);
        table.integer(constants.product);
        table.integer(constants.quantity).unsigned();
        table.foreign(constants.order).references(constants.id).inTable(constants.orders);
        table.foreign(constants.product).references(constants.id).inTable(constants.products);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(constants.positions);
};
