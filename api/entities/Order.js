const bookshelf = require('../database')
const consts = require('../consts')
const State = require("./State");

const Order = bookshelf.model('Order',
    {
        tableName: consts.orders,
        columns:
            {
                id: {type: consts.increments, primary: true},
                date: {type: 'date'},
                state: {type: consts.integer},
                userName: {type: consts.string},
                email: {type: consts.string},
                phoneNumber: {type: consts.string},
            },
        state() {
            return this.belongsTo(State, consts.state);
        }
    });

module.exports = Order;