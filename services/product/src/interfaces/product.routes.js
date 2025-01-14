const express = require("express");

const errorHandlerMiddleware = require("../../../shared/middlewares/errorHandlerMiddleware");
const authenticationMiddleware = require("../../../shared/middlewares/authenticationMiddleware");
const requestVerificationMiddleware = require("../../../shared/middlewares/requestVerificationMiddleware");

const {getProducts, fetchProductsByIds} = require("./product.controller");
const {getProductsValidation, fetchProductsByIdsValidation} = require("./product.validations");

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
router.get("/", authenticationMiddleware, requestVerificationMiddleware(getProductsValidation), errorHandlerMiddleware(getProducts));

/**
 * POST /products/batch
 * Retrieves products metadata for a given list of product IDs.
 */
router.post("/batch", authenticationMiddleware, requestVerificationMiddleware(fetchProductsByIdsValidation), errorHandlerMiddleware(fetchProductsByIds));


module.exports = router;
