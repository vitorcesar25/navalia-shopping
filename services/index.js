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

app.use('/products', productRoutes);

exports.api = functions.https.onRequest(app);