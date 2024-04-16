const constants = require('../consts')

exports.up = function (knex) {
    const data = [
        {
            name: 'Books',
        },
        {
            name: 'Toys',
        },
        {
            name: 'Electronics',
        }
    ]
    return knex(constants.categories).insert(data);
};

exports.down = function (knex) {
    return knex(constants.categories).truncate();
};
