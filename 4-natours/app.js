const fs = require('fs');
const express = require('express');

const app = express(); // adds methods to app

// Middleware: function that can modify incoming request data.
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from the server side‼',
    app: 'Node-tutorial, Natours project',
  });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

// Data getters

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route handlers

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});
// Start Listening

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
