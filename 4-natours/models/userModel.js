const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true, // removes whitespaces at the beginning and end
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    trim: true, // removes whitespaces at the beginning and end,
    unique: true,
    lowercase: true, // transforms the e-mail into lowercase
    validate: [validator.isEmail, 'Please enter a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on CREATE or on SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not equal!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // mongoose has a method that checks if a field has been modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // this deletes the field from the database

  next();
});

// Instance method: available on all documents of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password not available because the model avoids it
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false; // user has not changed his password
};

// Model

const User = mongoose.model('User', userSchema);

module.exports = User;
