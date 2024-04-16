const bookshelf = require('../database')
const consts = require('../consts')

const State = bookshelf.model('State',
    {
        tableName: consts.states,
        columns:
            {
                id: {type: consts.increments, primary: true},
                name: {type: consts.string}
            }
    });

module.exports = State;