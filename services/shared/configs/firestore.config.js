const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIRESTORE_PROJECT_ID || "navalia-shopping",
  });
}

const firestore = admin.firestore();

// Connect to Firestore Emulator if running locally
if (process.env.FIRESTORE_EMULATOR_HOST) {
  firestore.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
}

module.exports = firestore;
