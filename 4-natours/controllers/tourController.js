const Tour = require('../models/tourModel');

// HANDLERS

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.finOne({ _id: req.params.id }); // --> same result as above

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
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

exports.updateTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // the updated document will be returned
      runValidators: true
    });

    console.log("Tour", tour);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndDelete(req.params.id);

    console.log("Tour", tour);

    res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
};