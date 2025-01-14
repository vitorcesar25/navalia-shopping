const express = require('express');

const errorHandlerMiddleware = require('../../../shared/middlewares/errorHandlerMiddleware');
const authenticationMiddleware = require('../../../shared/middlewares/authenticationMiddleware');
const requestVerificationMiddleware = require('../../../shared/middlewares/requestVerificationMiddleware');

const { calculatePromotions } = require('./promotion.controller');
const { calculatePromotionsValidations, } = require('./promotion.validations');

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
router.post('/calculate', authenticationMiddleware, requestVerificationMiddleware(calculatePromotionsValidations), errorHandlerMiddleware(calculatePromotions));


module.exports = router;