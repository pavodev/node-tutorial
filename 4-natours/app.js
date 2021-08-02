const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express(); // adds methods to app

/*************** Global Middlewares **************/

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Apply the limited only to the api
app.use('/api', limiter);

// Body parser: reading data from body into req.body, also limits body size
// Middleware: function that can modify incoming request data.
app.use(express.json({ limit: '10kb' })); // use: adds a middleware to the middleware stack

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // looks at the query string and params and removes NoSQL injection strings.

// Data sanitization against XSS
app.use(xss()); // cleans malicious html code

// Prevent parameter pollution (for example duplicate query parameters in the request)
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);

/***************** SERVING STATIC FILES *****************/

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

/*************** Routers **************/

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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

/**************** Error middleware ****************/

/*
  Express already knows that this is an error middleware because there are 4 arguments in the handler function.
*/
app.use(globalErrorHandler);

module.exports = app;
