let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sqlite = require('sqlite3').verbose();
let cors = require('cors');

let indexRouter = require('./routes/index');
let categoriesRouter = require('./routes/categories');
let statesRouter = require('./routes/states');
let productsRouter = require('./routes/products');
let ordersRouter = require('./routes/orders')
const e = require("express");
let db = new sqlite.Database('api.db');

let app = express();
app.set('db', db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/states', statesRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
