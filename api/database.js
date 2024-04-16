const knex = require('knex')({
    client: 'sqlite3',
    connection:{
        filename: './api.db'
    }
});

const bookshelf = require('bookshelf')(knex);
module.exports = bookshelf;