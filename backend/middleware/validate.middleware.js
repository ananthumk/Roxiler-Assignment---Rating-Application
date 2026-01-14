const { signupSchema, loginSchema, updatePasswordSchema, addRatingSchema, updateRatingSchema } = require("../schemas/auth");


const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ message: errorMessage });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdatePassword = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateAddRating = (req, res, next) => {
  const { error } = addRatingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdateRating = (req, res, next) => {
  const { error } = updateRatingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateSignup , validateLogin, validateUpdatePassword, validateAddRating, validateUpdateRating };
