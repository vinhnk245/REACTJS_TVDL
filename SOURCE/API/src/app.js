
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const response = require('./commons/response');

var indexRouter = require('./routes');
var readerRouter = require('./routes/readerRouter');
var memberRouter = require('./routes/memberRouter');
var bookCategoryRouter = require('./routes/bookCategoryRouter');
var homeRouter = require('./routes/homeRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/reader', readerRouter);
app.use('/member', memberRouter);
app.use('/bookCategory', bookCategoryRouter);
app.use('/home', homeRouter);



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(response.error({
    code:404,
    message : 'API not found'
  }))
  // res.render('error');
});

module.exports = app;
