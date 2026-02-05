// middlewares/branchValidation.js
import Joi from 'joi';

export const validateBranch = (req, res, next) => {
    const schema = Joi.object({

        name: Joi.string().min(3).max(100).required(),
        address: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        zipCode: Joi.string().regex(/^\d{5,6}$/),
        phone: Joi.string().pattern(/^[0-9]+$/),
        email: Joi.string().email(),
        openingTime: Joi.string(),
        closingTime: Joi.string(),
        workingDays: Joi.array().items(Joi.string()),
        isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Validation Error", error: error.details[0].message });
    }
    next();
};