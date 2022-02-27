var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
let debug = require('debug');
const session = require('express-session');
const Handlebars = require('handlebars');
var hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const moment = require('moment');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const upload = multer();
var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '5mb' });
var indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    json: function (value) {
      if (value != undefined) {
        return JSON.stringify(value);
      } else {
        return false;
      }
    },
    switch: function (value, options) {
      this.switch_value = value;
      return options.fn(this);
    },
    case: function (value, options) {
      if (value == this.switch_value) {
        return options.fn(this);
      }
    },
    ifCond: function (value1, operator, value2, options) {
      switch (operator) {
        case '==':
          return (value1 == value2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (value1 === value2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (value1 != value2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (value1 !== value2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (value1 < value2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (value1 <= value2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (value1 > value2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (value1 >= value2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (value1 && value2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (value1 || value2) ? options.fn(this) : options.inverse(this);
      }
    },
    ifIn: function (elem, list, options) {
      if (typeof list == 'string') {
        list = list.split(',');
      }
      if (list != undefined) {
        if (list.indexOf(elem) > -1) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      } else {
        return options.inverse(this);
      }
    },
    debug: function (data) {
      console.log(data);
    },
    date_format: function (date, current_fromat, required_fromat) {
      return moment(date, current_fromat).format(required_fromat);
    },
    formatDate: function (dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Handlebars.SafeString(
          date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
          '-' + date.getDate().toString().padStart(2, 0)
      );
    },
    get: function (obj, prop) {
      return obj[prop];
    },
    multiply: function (value1, value2) {
      return value1 * value2;
    },
    codeString: function (value) {
      return value.replace(/(<([^>]+)>)/ig, '');
    }
  }
}));
app.set('view engine', 'hbs');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_module', express.static(__dirname + '/node_modules/'));
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}))


mongoose.connect('mongodb://localhost:27017/webin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;

if (!db) {
  debug('Error connecting database');
} else {
  debug('Database connected webin connected');
}




app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// //database connection
// MongoClient.connect('mongodb://localhost:27017/webin', function (err, db) {
//   if (err) throw err
// })










// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.use(function (err, req, res, next) {
  console.log(req.app.get('env'));
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  let page_data = {};
  page_data.layout = false;
  page_data.title = 'STREAMING | ERROR';
  page_data.status = err.status;
  page_data.message = err.message;
  res.render('error', page_data);
});

module.exports = app;