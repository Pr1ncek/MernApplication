const Validator = require('validator');
const isEmpty = require('./utils/is-empty');

const validateEducationInputs = data => {
  const errors = {};
  const { school = '', degree = '', major = '', location = '', from = '' } = data;

  if (Validator.isEmpty(school)) {
    errors.school = 'School is required';
  }

  if (Validator.isEmpty(degree)) {
    errors.degree = 'Degree is required';
  }

  if (Validator.isEmpty(major)) {
    errors.major = 'Major date is required';
  }

  if (Validator.isEmpty(location)) {
    errors.location = 'Location is required';
  }

  if (Validator.isEmpty(from)) {
    errors.from = 'From date is required';
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateEducationInputs;
