const Validator = require('validator');
const isEmpty = require('./utils/is-empty');

const validatePostInputs = data => {
  const errors = {};
  const { text = '' } = data;

  if (Validator.isEmpty(text) || !Validator.isLength(text, { min: 15, max: 400 })) {
    errors.post = 'Post must be atleast 15 characters';
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validatePostInputs;
