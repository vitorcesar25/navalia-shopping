const express = require("express");

const errorMiddleware = require("../../../shared/middlewares/errorMiddleware");
const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const requestMiddleware = require("../../../shared/middlewares/requestMiddleware");

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
router.get("/", authMiddleware, requestMiddleware(getProductsValidation), errorMiddleware(getProducts));

/**
 * POST /products/batch
 * Retrieves products metadata for a given list of product IDs.
 */
router.post("/batch", authMiddleware, requestMiddleware(fetchProductsByIdsValidation), errorMiddleware(fetchProductsByIds));


module.exports = router;
