const {Router} = require("express");
const {getCartByUserId, clearCartByUserId, updateCartItem} = require("./cart.controller");
const {updateCartItemValidations} = require("./cart.validations");
const errorMiddleware = require("../../../shared/middlewares/errorMiddleware");
const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const requestMiddleware = require("../../../shared/middlewares/requestMiddleware");

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
router.get("/", authMiddleware, errorMiddleware(getCartByUserId));

/**
 * DELETE /carts
 * Clears the cart for the authenticated user.
 */
router.delete("/", authMiddleware, errorMiddleware(clearCartByUserId));

/**
 * PATCH /carts/items
 * Updates the quantity of an item in the cart, add it if it doesn't exist or remove it from cart.
 */
router.patch("/items", authMiddleware, requestMiddleware(updateCartItemValidations), errorMiddleware(updateCartItem));

module.exports = router;

