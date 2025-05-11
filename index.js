require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");
// const { sendPushNotification } = require("./sendNotifications");
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🧪 Test route
app.get("/hello", (req, res) => {
  res.send("Hello from the Magic Shelf!");
});

// 📨 Send an emotion
app.post("/send-emotion", async (req, res) => {
  const { from_user_id, to_user_id, emotion, to_user_fcm_token } = req.body;

  // 1. Save to Supabase
  const { error } = await supabase
    .from("emotions")
    .insert([{ from_user: from_user_id, to_user: to_user_id, emotion }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 2. Push Notification (optional)
  if (to_user_fcm_token) {
    await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: to_user_fcm_token,
        notification: {
          title: "Emocija stigla!",
          body: emotion,
        },
      }),
    });
  }

  res.json({ success: true });
});

// 🧾 Fetch emotions for a user
app.get("/my-emotions/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("emotions")
    .select("*")
    .eq("to_user", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// app.post("/send-emotion", async (req, res) => {
//   const { token, emotion } = req.body;

//   try {
//     await sendPushNotification(token, emotion);
//     res.send("Notification sent!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error sending notification");
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kitchen is open on port ${PORT}!`);
});
