// middlewares/branchValidation.js
import Joi from 'joi';

export const validateBranch = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        address: Joi.string().min(5).required(), // Required for location
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().regex(/^\d{5,6}$/).required(),
        
        phone: Joi.string().pattern(/^[0-9+ ]+$/).required(),
        email: Joi.string().email().required(),
        
        openingTime: Joi.string().required(), // e.g., "09:00 AM"
        closingTime: Joi.string().required(), // e.g., "06:00 PM"
        
        // Ensure they select at least one day
        workingDays: Joi.array().items(Joi.string()).min(1).required(),
        
        isActive: Joi.boolean().optional() // Still optional as it defaults to true in DB
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.details[0].message 
        });
    }
    next();
};