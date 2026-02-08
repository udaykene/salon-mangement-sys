import Joi from "joi";

export const SignUpValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^[0-9+ ]+$/)
      .min(10)
      .max(15)
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.valid(Joi.ref("password")).required(),
    agreeTerms: Joi.boolean()
      .invalid(false)
      .required()
      .messages({
        "any.invalid": "You must agree to the terms and conditions",
      }),
    newsletter: Joi.boolean().optional(),
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

export const LoginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
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

export const StaffLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string()
      .pattern(/^[0-9+ ]+$/)
      .min(10)
      .max(15)
      .required()
      .messages({
        "string.pattern.base": "Phone number must contain only digits, +, and spaces",
        "string.min": "Phone number must be at least 10 characters",
        "string.max": "Phone number must not exceed 15 characters",
        "any.required": "Phone number is required"
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
