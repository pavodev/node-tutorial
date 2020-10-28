const Tour = require('../models/tourModel');

// HANDLERS

exports.aliasTopTours = async (req, res, next) => {
  (req.query.limit = '5'), (req.query.sort = '-ratingsAverage,price');
  req.query.fields = 'name,price,ratingsAverage,summary,diffculty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD THE QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];
    exludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering

    // What we want: { difficulty: 'easy', duration: { $gte: 5 } }
    // What we get from the query: { difficulty: 'easy', duration: { gte: '5' } }
    // gte, gt, lte, lt

    let queryString = JSON.stringify(queryObj);

    /*
      ()    --> includes the operators
      '/b'  --> match the exact words (operators)
      '/g'  --> must happen multiple time (without the g, it replaces only the first occurence)

      The callback appends $ to the matched string
    */
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryString));

    // 2) Sorting
    if (req.query.sort) {
      // if we want to sort by multiple fields, mongoose wants them separated by spase (for example 'price ratingsAverage name'). In http requests we can not add spaces in the query so we establish that the sort arguments must be separated by a comma: /tours/sort=price,ratingsAverage
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field Limiting
    // only return request defined fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields); // this is called 'projecting
    } else {
      // the minus excludes a field from the selection
      query = query.select('-__v');
    }

    // 4) Pagination
    // page=2&limit=10 --> page 1: 1-10, page 2: 11-20, etc.
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE THE QUERY
    const tours = await query;

    // using the method below would have resulted in a huge method concatenation
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
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
      status: 'fail',
      message: err,
    });
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
      runValidators: true,
    });

    console.log('Tour', tour);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    console.log('Tour', tour);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
