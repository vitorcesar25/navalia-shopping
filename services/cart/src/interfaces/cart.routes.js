const {Router} = require("express");
const {getCartByUserId, clearCartByUserId, updateCartItem} = require("./cart.controller");
const {updateCartItemValidations} = require("./cart.validations");
const errorHandlerMiddleware = require("../../../shared/middlewares/errorHandlerMiddleware");
const authenticationMiddleware = require("../../../shared/middlewares/authenticationMiddleware");
const requestVerificationMiddleware = require("../../../shared/middlewares/requestVerificationMiddleware");

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
router.get("/", authenticationMiddleware, errorHandlerMiddleware(getCartByUserId));

/**
 * DELETE /carts
 * Clears the cart for the authenticated user.
 */
router.delete("/", authenticationMiddleware, errorHandlerMiddleware(clearCartByUserId));

/**
 * PATCH /carts/items
 * Updates the quantity of an item in the cart, add it if it doesn't exist or remove it from cart.
 */
router.patch("/items", authenticationMiddleware, requestVerificationMiddleware(updateCartItemValidations), errorHandlerMiddleware(updateCartItem));

module.exports = router;

