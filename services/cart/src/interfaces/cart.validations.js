module.exports = {
  updateCartItemValidations: {
    productId: {
      in: ["body"],
      errorMessage: "Product ID is required",
      isString: true,
      notEmpty: {
        errorMessage: "Product ID cannot be empty.",
      },
      trim: true,
    },
    quantity: {
      in: ["body"],
      errorMessage: "Quantity is required and must be a valid number.",
      isInt: {
        options: {min: 0, max: 1000},
        errorMessage: "Quantity must be a non-negative integer less than 1000.",
      },
      toInt: true,
    },
  },
};
