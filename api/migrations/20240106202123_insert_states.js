const constants = require('../consts')

exports.up = function (knex) {
    const data = [
        {
            name: 'Not confirmed',
        },
        {
            name: 'Confirmed',
        },
        {
            name: 'Canceled',
        },
        {
            name: 'Finished',
        }
    ]
    return knex(constants.states).insert(data);
};

exports.down = function (knex) {
    return knex(constants.states).truncate();
};
