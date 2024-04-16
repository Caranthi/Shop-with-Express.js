const bookshelf = require('../database')
const consts = require('../consts')
const Order = require("./Order");
const Product = require("./Product");

const Position = bookshelf.model('Position',
    {
       tableName: consts.positions,
       columns:
           {
               id: {type: consts.increments, primary: true},
               order: {type: consts.integer},
               product: {type: consts.integer},
               quantity: {type: consts.integer},
           },
        order()
        {
            return this.belongsTo(Order, consts.order);
        },
        product()
        {
            return this.belongsTo(Product, consts.product);
        }
    });

module.exports = Position;