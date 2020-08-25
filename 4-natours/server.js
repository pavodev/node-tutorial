const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

const app = require('./app');

// by default it is set by express to 'development'
// console.log(app.get('env'));

// Node environement variables
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
