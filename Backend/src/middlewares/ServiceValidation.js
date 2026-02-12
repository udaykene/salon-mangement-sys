import Joi from "joi";

export const validateService = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().required(), // Category ObjectId as string
    gender: Joi.string().valid("Men", "Female", "Unisex").required(),
    desc: Joi.string().allow("").optional(),
    price: Joi.number().positive().required(),
    duration: Joi.string().required(), // e.g., "45 min", "1.5 hrs"
    icon: Joi.string().optional(),
    gradient: Joi.string().optional(),
    status: Joi.string().valid("active", "inactive").optional(),
    branchId: Joi.string().required(), // MongoDB ObjectId as string
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
