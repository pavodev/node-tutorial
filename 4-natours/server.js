const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(port, () => {
  // console.log(`App running on port ${port}...`);
});
