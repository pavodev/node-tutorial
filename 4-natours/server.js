const dotenv = require('dotenv');
const mongoose = require('mongoose');

// HANDLING SYNCHRONOUS ERRORS

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥💥 Shutting down...');
  console.log(err.name, err.message);

  // gracefully close the server before shutting down the process
  process.exit(1);
});

// Trigger an uncaught expection

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const app = require('./app');

// by default it is set by express to 'development'
// console.log(app.get('env'));

// Node environement variables
// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// HANDLING ASYNCHRONOUS ERRORS

// Handling all promise rejections that cannot be handled by the general error handlers.
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!💥💥 Shutting down...');
  console.log(err.name, err.message);

  // gracefully close the server before shutting down the process
  server.close(() => {
    process.exit(1);
  });
});
