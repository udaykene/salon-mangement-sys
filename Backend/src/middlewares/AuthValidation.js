const Joi = require('joi');

const SignUpValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'First name is required',
            }),
        lastName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'Last name is required',
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
            }),
        phone: Joi.string()
            .pattern(/^[0-9+ ]+$/)
            .min(10)
            .max(15)
            .required()
            .messages({
                'string.pattern.base': 'Phone number contains invalid characters',
            }),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must include uppercase, lowercase, and a number',
            }),
        confirmPassword: Joi.any()
            .equal(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
            })
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


const SignUpValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'First name is required',
            }),
        lastName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'Last name is required',
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
            }),
        phone: Joi.string()
            .pattern(/^[0-9+ ]+$/)
            .min(10)
            .max(15)
            .required()
            .messages({
                'string.pattern.base': 'Phone number contains invalid characters',
            }),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must include uppercase, lowercase, and a number',
            }),
        confirmPassword: Joi.any()
            .equal(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
            })
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



const LoginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required',
            }),
        rememberMe: Joi.boolean() // Captured from the checkbox in your UI
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


module.exports = {SignUpValidation,LoginValidation};