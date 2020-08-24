const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express(); // adds methods to app

// Middleware: function that can modify incoming request data.
app.use(express.json()); // use: adds a middleware to the middleware stack

// Middlewares

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from our own middleware 😉');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Data getters

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Handlers

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // trick

  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    // results: tours.length,
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      }); // 201 CREATED
    }
  );

  // res.send('Done');
};

const updateTour = (req, res) => {
  const id = req.params.id;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
  // will be implemented in the MongoDB section
};

const deleteTour = (req, res) => {
  const id = req.params.id;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    // no content code
    status: 'success',
    data: null,
  });
  // will be implemented in the MongoDB section
};

// Routes

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start Listening

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
