const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string()
    .min(20)
    .max(60)
    .required()
    .messages({
      'string.min': 'The length of name should be between 20 to 60',
      'string.max': 'The length of name should be between 20 to 60',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),

  address: Joi.string()
    .max(400)
    .required()
    .messages({
      'string.max': 'Address length should not be greater than 400 characters',
      'any.required': 'Address is required'
    }),

  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    .required()
    .messages({
      'string.min': 'Password must be 8–16 characters long',
      'string.max': 'Password must be 8–16 characters long',
      'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
      'any.required': 'Password is required'
    }),

    role: Joi.string()
    .valid('admin', 'user', 'owner')
    .required()
    .messages({
      'any.only': 'Role must be one of admin, user, or owner',
      'any.required': 'Role is required'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Password is required',
      'any.required': 'Password is required'
    })
});

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Old password is required',
      'any.required': 'Old password is required'
    }),

  newPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    .required()
    .messages({
      'string.min': 'New password must be 8–16 characters long',
      'string.max': 'New password must be 8–16 characters long',
      'string.pattern.base': 'New password must include at least one uppercase letter and one special character',
      'any.required': 'New password is required'
    })
});

const addRatingSchema = Joi.object({
  storeId: Joi.number()
    .required()
    .messages({
      'number.base': 'Store ID must be a number',
      'any.required': 'Store ID is required'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    })
});

const updateRatingSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    })
});

module.exports = { signupSchema, loginSchema, updatePasswordSchema, addRatingSchema, updateRatingSchema };
