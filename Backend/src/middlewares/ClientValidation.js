import Joi from "joi";

export const CreateClientValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 100 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),
    phone: Joi.string()
      .pattern(/^[0-9+\s\-()]{10,15}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Please provide a valid phone number",
      }),
    location: Joi.string().allow("").max(200).optional(),
    branchId: Joi.string().optional(), // Optional because receptionist won't send it
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details[0].message,
    });
  }
  next();
};

export const UpdateClientValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string()
      .pattern(/^[0-9+\s\-()]{10,15}$/)
      .optional(),
    location: Joi.string().allow("").max(200).optional(),
    branchId: Joi.string().optional(), // Only admin can change this
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details[0].message,
    });
  }
  next();
};
