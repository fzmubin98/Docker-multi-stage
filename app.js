const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const message = process.env.NODE_ENV === 'development' ? 'Hello dev!' : 'Hello World!';
  res.send(message);
});

// Health check route
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;