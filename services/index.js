const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();


if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIRESTORE_PROJECT_ID,
    });
}

const app = express();
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const productRoutes = require('./product/src/interfaces/product.routes');
const cartRoutes = require('./cart/src/interfaces/cart.routes');
const promotionRoutes = require('./promotion/src/interfaces/promotion.routes');

app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/promotions', promotionRoutes);

exports.api = functions.https.onRequest(app);