import Joi from "joi";

export const CustomerSignUpValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 100 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    phone: Joi.string()
      .pattern(/^[0-9+ ]+$/)
      .min(10)
      .max(15)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must contain only digits, +, and spaces",
        "string.min": "Phone number must be at least 10 characters",
        "string.max": "Phone number must not exceed 15 characters",
        "any.required": "Phone number is required",
      }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

export const CustomerLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

export const CustomerProfileUpdateValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string()
      .pattern(/^[0-9+ ]+$/)
      .min(10)
      .max(15)
      .optional(),
    gender: Joi.string()
      .valid("male", "female", "other")
      .optional()
      .allow(null, ""),
    address: Joi.string().max(500).optional().allow(""),
    email: Joi.forbidden().messages({
      "any.unknown": "Email cannot be updated from profile",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
