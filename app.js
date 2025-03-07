const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const expressLayouts = require('express-ejs-layouts');
const ExpressError = require('./utils/ErrorHandler');
const errorHandler = require('./middlewares/errorHandler');
const User = require('./models/user');


const app = express();

// Database connection
mongoose.connect('mongodb://127.0.0.1/employee-attendance')
.then((result) => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log(err)
});

// Middleware setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/app');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(session({
    secret: 'thisshouldbeabettersecret-n239432r93ni2349872693n8tgegy10239812847zmokadpj28u4u90cwermc624',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

app.use(express.json());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash message middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) =>{
    res.render('home');
});

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');

app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/index', indexRoutes);
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);

app.use((req, res, next) => {
    res.locals.title = "Employee Management System"; // Default title
    next();
});


// 404 Handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});


// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
