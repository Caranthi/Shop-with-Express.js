const constants = require("../consts");

exports.up = function(knex) {
    return knex.schema.createTable(constants.orders, (table) =>
    {
        table.increments(constants.id).unsigned().primary();
        table.date(constants.date).nullable();
        table.integer(constants.state);
        table.string(constants.userName);
        table.string(constants.email);
        table.string(constants.phoneNumber);
        table.foreign(constants.state).references(constants.id).inTable(constants.states);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(constants.orders);
};
