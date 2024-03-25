// install reuired packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let session = require('express-session');
let passport = require('passport');
let bodyParser = require('body-parser');


// set the environment variable
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// set the required routes
let authRouter = require('./routes/auth');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let caseRouter = require('./routes/case');
let app = express();

// set the required middlewares
app.use(express.urlencoded({ extended: false }));

// connect to Mongo database
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('MongoDB connection failed'));


  // set the required middlewares
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false
}));

// set the views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  set the passport auth
app.use(passport.initialize());
app.use(passport.session());

// set the required routes
let User = require('./models/user');
passport.use(User.createStrategy());

// set the passport auth
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set the required routes
app.use('/', indexRouter);
app.use('/', authRouter); 
app.use('/', usersRouter);
app.use('/', caseRouter);


// create 404 error
app.use(function(req, res, next) {
  next(createError(404));
});

// create error handler
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;