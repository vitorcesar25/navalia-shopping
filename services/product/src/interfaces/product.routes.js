const express = require('express');

const errorHandlerMiddleware = require('../../../shared/middlewares/errorHandlerMiddleware');
const authenticationMiddleware = require('../../../shared/middlewares/authenticationMiddleware');
const requestVerificationMiddleware = require('../../../shared/middlewares/requestVerificationMiddleware');

const { getProducts } = require('./product.controller');
const { getProductsValidation } = require('./product.validations');

const router = express.Router();
/**
 * Router for products endpoints.
 * 
 * @module productRouter
 */


/**
 * GET /products
 * Retrieves a list of available products.
 */
router.get('/', authenticationMiddleware, requestVerificationMiddleware(getProductsValidation), errorHandlerMiddleware(getProducts));

module.exports = router;