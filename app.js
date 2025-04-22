const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Health check route
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app; // Export for testing