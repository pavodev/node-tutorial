const Tour = require('../models/tourModel');

// HANDLERS

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // requestedAt: req.requestTime,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  // const id = req.params.id * 1; // trick

  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   // results: tours.length,
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  // method called on the document
  // const newTour = new Tour({ })
  // newTour.save();

  // method called directly on the tour
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    }); // 201 CREATED
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
  // will be implemented in the MongoDB section
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    // no content code
    status: 'success',
    data: null,
  });
  // will be implemented in the MongoDB section
};
