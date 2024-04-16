const bookshelf = require('../database')
const consts = require('../consts')

const Category = bookshelf.model('Category',
    {
        tableName: consts.categories,
        columns:
            {
                id: {type: consts.increments, primary: true},
                name: {type: consts.string}
            }
    });

module.exports = Category;