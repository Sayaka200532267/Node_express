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

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

let authRouter = require('./routes/auth');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let caseRouter = require('./routes/case');

let app = express();

app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB after dotenv configuration
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('MongoDB connection failed'));

// Set up session middleware
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 2. enable passport w/sessions
app.use(passport.initialize());
app.use(passport.session());

// 3. link passport to our User model & use local strategy by default
let User = require('./models/user');
passport.use(User.createStrategy());

// 4. enable session reads / writes for passport users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Define routes
app.use('/', indexRouter);
app.use('/', authRouter); 
app.use('/', usersRouter);
app.use('/', caseRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
