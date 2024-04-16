const constants = require("../consts");

exports.up = function(knex) {
  
};

exports.down = function(knex) {
    return knex(constants.products).truncate();
};
