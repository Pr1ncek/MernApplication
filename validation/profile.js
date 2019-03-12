const Validator = require('validator');
const isEmpty = require('./utils/is-empty');

const validateProfileInputs = data => {
  const errors = {};
  const { handle = '', status = '', skills = '' } = data;

  const websites = ['youtube', 'twitter', 'instagram', 'facebook', 'portfolio', 'linkedin'];
  websites.forEach(website => {
    if (!isEmpty(data[website]))
      if (!Validator.isURL(data[website])) errors[website] = `Must be a valid URL`;
  });

  if (!Validator.isLength(handle, { min: 2, max: 25 })) {
    errors.handle = 'Profile handle must be between 2 and 25 characters';
  }
  if (Validator.isEmpty(handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (Validator.isEmpty(status)) {
    errors.status = 'Profile status is required';
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = 'Skills field is required';
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateProfileInputs;
