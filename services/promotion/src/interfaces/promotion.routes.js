const express = require("express");

const errorMiddleware = require("../../../shared/middlewares/errorMiddleware");
const authMiddleware = require("../../../shared/middlewares/authMiddleware");
const requestMiddleware = require("../../../shared/middlewares/requestMiddleware");

const {calculatePromotions} = require("./promotion.controller");
const {calculatePromotionsValidations} = require("./promotion.validations");

const router = express.Router();
/**
 * Router for promotions endpoints.
 *
 * @module promotionRouter
 */


/**
 * POST /promotions
 * Calculate promotions from cartItems and user vip status.
 */
router.post("/calculate", authMiddleware, requestMiddleware(calculatePromotionsValidations), errorMiddleware(calculatePromotions));


module.exports = router;
