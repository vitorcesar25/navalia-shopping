// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Define a secret key (ensure you store this securely in a real application)
const secretKey = 'navalia-shopping';

// Define the payload (data to include in the token)
const payload = {
    userId: 'user2',
    isVip: false
};

// Generate the token
try {
    const token = jwt.sign(payload, secretKey);
    console.log('Generated JWT:', token);
} catch (err) {
    console.error('Error generating JWT:', err);
}