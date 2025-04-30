const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

// Define a model
const ItemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model('Item', ItemSchema);

app.get('/', async (req, res) => {
  const items = await Item.find();
  res.send(items.length > 0 ? items : 'No items found');
});

app.get('/add-item/:name', async (req, res) => {
  const newItem = new Item({ name: req.params.name });
  await newItem.save();
  res.send(`Added ${req.params.name}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;