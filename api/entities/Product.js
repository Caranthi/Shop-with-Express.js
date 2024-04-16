const bookshelf = require('../database')
const consts = require('../consts')
const Category = require("./Category");

const Product = bookshelf.model('Product',
    {
       tableName: consts.products,

       columns:
           {
               id: {type: consts.increments, primary: true},
               name: {type: consts.string},
               description: {type: consts.string},
               price: {type: consts.float},
               weight: {type: consts.float},
               category: {type: consts.integer},
           },
        category() {
            return this.belongsTo(Category, consts.category);
        },
    });

module.exports = Product;