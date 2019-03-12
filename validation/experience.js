const Validator = require('validator');
const isEmpty = require('./utils/is-empty');

const validateExperienceInputs = data => {
  const errors = {};
  const { title = '', company = '', from = '', location = '' } = data;

  if (Validator.isEmpty(title)) {
    errors.title = 'Title is required';
  }

  if (Validator.isEmpty(company)) {
    errors.company = 'Company is required';
  }

  if (Validator.isEmpty(from)) {
    errors.from = 'From date is required';
  }

  if (Validator.isEmpty(location)) {
    errors.location = 'Location is required';
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateExperienceInputs;
