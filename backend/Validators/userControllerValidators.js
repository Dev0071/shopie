import Joi from "joi"


const validateRegisterSchema = Joi.object({
    u_name: Joi.string()
        .required()
        .min(3)
        .messages({
            'string.base': 'nvalid Name Format',
            'string.empty': 'Name is required',
            'string.min': 'Name must have at least 3 characters'
        }),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
        .messages({
            'string.base': 'Email should be in the right format',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$'))
        .messages({
            'string.base': 'Password should be a string',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must contain at least one letter, one number, and be at least 6 characters long'
        }),
    session_id: Joi.string()
});


const validateloginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) .messages({
        'string.base': 'Email should be in the right format',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().required().messages({
        'password.empty': 'Password is required',
    }),
    session_id: Joi.string()
})

const validateUpdatePassword = Joi.object({
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$'))
        .messages({
            'string.base': 'Password should be a string',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must contain at least one letter, one number, and be at least 6 characters long'
        })
})

export {validateRegisterSchema,validateloginSchema,validateUpdatePassword};
