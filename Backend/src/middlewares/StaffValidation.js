import Joi from "joi";

export const createStaffSchema = Joi.object({
  ownerId: Joi.string().hex().length(24).required(),

  branchId: Joi.string().hex().length(24).required(),

  name: Joi.string().trim().min(2).max(100).required(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+()\-\s]{7,20}$/)
    .required(),

  email: Joi.string().email().allow(null, "").optional(),

  password: Joi.forbidden(),

  role: Joi.string().trim().required(),

  // Comes as "Haircut, Color" from form → you’ll split before saving
  specialization: Joi.array().items(Joi.string().trim().min(1)).optional(),

  salary: Joi.number().min(0).required(),

  commission: Joi.number().min(0).max(100).optional(),

  workingDays: Joi.array()
    .items(Joi.string().valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"))
    .min(1)
    .required(),

  workingHours: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }).required(),

  status: Joi.string()
    .valid("active", "on-leave", "inactive")
    .default("active"),
});
