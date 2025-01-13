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
module.exports = {
    getProductsValidation
};