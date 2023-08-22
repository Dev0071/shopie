import Joi from "joi"

export const validateProductAddSchema = Joi.object({
    product_name: Joi.string()
    .required()
    .min(3)
    .messages({
        'string.base': 'Invalid Name Format',
        'string.empty': 'Product Name is required',
        'string.min': 'Name must have at least 3 characters'
    }),
    product_description: Joi.string()
    .required()
    .min(3)
    .messages({
        'string.base': 'Invalid Description Format',
        'string.empty': 'Product Description is required',
        'string.min': 'Description must have at least 3 characters'
    }),
    product_quantity: Joi.number()
    .required()
    .min(3)
    .messages({
        'string.base': 'Invalid Quantity Format',
        'string.empty': 'Product Description is required',
        'string.min': 'Name must have at least 3 characters'
    }),
    product_category: Joi.string()
    .required().messages(
        {
            "string.base": "Invalid Category Format",
            "string.empty": "Category is required"
        }
    ),
    product_image: Joi.string(),
    price: Joi.number(),

}

)

export const validateCartSchema = Joi.object({
    product_id: Joi.string().required().messages({
        "string.base": "Invalid Product Id Format",
        "string.empty": "Product Id is required"

    }),
    product_quantity: Joi.number().min(1).required().messages({
        "string.base": "Invalid Quantity Format",
        "string.empty": "Quantity is required",
        'string.min': 'Name must have at least 3 characters'

    })

    

})