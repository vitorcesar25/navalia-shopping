const getProductsValidation = {
    startAfter: {
        in: ['query'],
        optional: true,
        isString: true,
    },
    limit: {
        in: ['query'],
        optional: true,
        isInt: {
            options: { min: 1, max: 100 },
            errorMessage: 'Limit must be an integer between 1 and 100',
        },
        toInt: true,
    },
};

const fetchProductsByIdsValidation = {
    productIds: {
        in: ['body'],
        errorMessage: 'Product IDs are required and must be an array',
        isArray: {
            options: { min: 1, max: 10 },
            errorMessage: 'Product IDs must be an array with at least 1 and at most 10 items',
        },
        custom: {
            options: (value) => value.every((id) => typeof id === 'string'), // Ensure all items are strings
            errorMessage: 'All product IDs must be strings',
        },
    },
};
module.exports = {
    getProductsValidation,
    fetchProductsByIdsValidation,
};
