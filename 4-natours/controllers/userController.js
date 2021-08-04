const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory');

const filterObject = (obj, ...allowedFields) => {
  const newObject = {};

  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObject[key] = obj[key];
  });

  return newObject;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// for currently logged in user
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );

  // 2) Filter out unwanted fields that have been sent in the request
  const filteredBody = filterObject(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // returns the updated object instead of the old one
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

// Admin

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); // Do not change password with this
exports.deleteUser = factory.deleteOne(User);
