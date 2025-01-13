const { Router } = require("express");
const { getCartByUserId } = require('./cart.controller');

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

module.exports = router;