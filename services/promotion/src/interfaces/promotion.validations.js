const calculatePromotionsValidations = {
    cartItems: {
        in: ['body'],
        isArray: {
            errorMessage: 'cartItems must be an array of cart items.',
        },
        notEmpty: {
            errorMessage: 'cartItems cannot be empty.',
        },
    },
    'cartItems.*.productId': {
        in: ['body'],
        isString: {
            errorMessage: 'Each cart item must have a productId of type string.',
        },
        notEmpty: {
            errorMessage: 'productId is required for each cart item.',
        },
    },
    'cartItems.*.price': {
        in: ['body'],
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Each cart item must have a valid price greater than or equal to 0.',
        },
    },
    'cartItems.*.quantity': {
        in: ['body'],
        isInt: {
            options: { min: 1 },
            errorMessage: 'Each cart item must have a quantity greater than 0.',
        },
    },
};

module.exports = { calculatePromotionsValidations };