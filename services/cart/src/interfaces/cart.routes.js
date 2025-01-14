const { Router } = require("express");
const { getCartByUserId, clearCartByUserId } = require('./cart.controller');

const errorHandlerMiddleware = require('../../../shared/middlewares/errorHandlerMiddleware');
const authenticationMiddleware = require('../../../shared/middlewares/authenticationMiddleware');
const requestVerificationMiddleware = require('../../../shared/middlewares/requestVerificationMiddleware');

const router = Router();
/**
 * Router for cart-related endpoints.
 * 
 * @module cartRouter
 */

/**
 * GET /carts
 * Retrieves the cart for the authenticated user.
 */
router.get('/', authenticationMiddleware, errorHandlerMiddleware(getCartByUserId));

/**
 * DELETE /carts
 * Clears the cart for the authenticated user.
 */
router.delete('/', authenticationMiddleware, errorHandlerMiddleware(clearCartByUserId));

module.exports = router;
