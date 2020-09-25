
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var bodyParser = require('body-parser');
var response = require('./commons/response');

var indexRouter = require('./routes');
var readerRouter = require('./routes/readerRouter');
var memberRouter = require('./routes/memberRouter');
var bookCategoryRouter = require('./routes/bookCategoryRouter');
var homeRouter = require('./routes/homeRouter');
var bookRouter = require('./routes/bookRouter');
var volunteerRouter = require('./routes/volunteerRouter');
var eventRouter = require('./routes/eventRouter')
var rentedRouter = require('./routes/rentedRouter')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/reader', readerRouter);
app.use('/member', memberRouter);
app.use('/bookCategory', bookCategoryRouter);
app.use('/home', homeRouter);
app.use('/book', bookRouter);
app.use('/volunteer', volunteerRouter);
app.use('/event', eventRouter);
app.use('/rented', rentedRouter);


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
