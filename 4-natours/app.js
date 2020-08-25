const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); // adds methods to app

// Middleware: function that can modify incoming request data.
app.use(express.json()); // use: adds a middleware to the middleware stack

// STATIC FILES
app.use(express.static(`${__dirname}/public`)); // 127.0.0.1/overview.html, public "becomes" the root

// Middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log('Hello from our own middleware 😉');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routers

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
