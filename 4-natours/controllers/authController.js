const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signedToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and pwd exist

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400)); // 400 Bad request, return to be sure that the login function finishes!
  }

  // 2) Check if user exists && password is correct

  const user = await User.findOne({ email }).select('+password'); // need to select explicitely the password because it has been excluded inside the model

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // 401 Unauthorized
  }

  // 3) If ok, send the token back to the client

  const token = signedToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Check token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please login to get access to the requested resource.',
        401
      )
    );
  }

  // 2) Verify token

  /* 
    jwt.verify gets a callback as third argument but as we want to keep using async/await, the jwt.verify function must be converted to a promise. 
    To do that we use the built-in node promisify function. The second parenthesis calls the function.
  */
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued

  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // Grant access to the protected route!

  req.user = currentUser;
  next();
});

// ...roles creates an array of all the arguments that we specify
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // the current user has been stored on the request object in the protect method above
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  // 2) Generate the random reset token

  // 3) send it to user's email
});

exports.resetPassword = (req, res, next) => {};
