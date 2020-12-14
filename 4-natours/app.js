const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); // adds methods to app

// Middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware: function that can modify incoming request data.
app.use(express.json()); // use: adds a middleware to the middleware stack

// STATIC FILES

app.use(express.static(`${__dirname}/public`)); // 127.0.0.1/overview.html, public "becomes" the root

app.use((req, res, next) => {
  console.log('Hello from our own middleware 😉');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Routers

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unknown routes middleware

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // })

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // If the next function recieves an argument, no matter what, Express will automatically know that there was an error and trigger the error middleware! This happens in any other middleware!!
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error middleware

/*
  Express already knows that this is an error middleware because there are 4 arguments in the handler function.
*/
app.use(globalErrorHandler);

module.exports = app;
