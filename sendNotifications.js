// backend/sendNotification.js
const admin = require("firebase-admin");
const serviceAccount = require("./path/to/serviceAccountKey.json"); // Your downloaded file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendPushNotification(token, emotion) {
  const message = {
    notification: {
      title: "Nova emocija!",
      body: `Tvoj prijatelj se osjeća: ${emotion}`,
    },
    token,
  };

  return admin.messaging().send(message);
}

module.exports = { sendPushNotification };
