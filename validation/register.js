const Validator = require('validator');
const isEmpty = require('./utils/is-empty');

const validateRegistrationInputs = data => {
  const errors = {};
  const { name = '', email = '', password = '', confirmPassword = '' } = data;

  if (!Validator.isLength(name, { min: 2, max: 20 })) {
    errors.name = 'Name must be between 2 and 20 characters';
  }
  if (Validator.isEmpty(name)) {
    errors.name = 'Name is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!Validator.isLength(password, { min: 5, max: 30 })) {
    errors.password = 'Password must be atleast 5 characters';
  }

  if (!Validator.equals(password, confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateRegistrationInputs;
