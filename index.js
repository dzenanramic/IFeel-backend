const express = require('express');
const app = express();

// This lets your backend understand messages from your app
app.use(express.json());

// A test rule: when someone visits "/hello", say hi!
app.get('/hello', (req, res) => {
  res.send('Hello from the Magic Shelf!');
});

// Start the backend
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kitchen is open on port ${PORT}!`);
});
