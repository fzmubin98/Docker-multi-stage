const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // For parsing POST/PUT bodies
const app = express();
const port = 3000;


// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://mongo:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to MongoDB"));

// Schema and Model
const ItemSchema = new mongoose.Schema({
  name: String,
  done: { type: Boolean, default: false }  // Add done field
});

const Item = mongoose.model('Item', ItemSchema);

// ROUTES

// Read all items
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Create a new item
app.post('/items', async (req, res) => {
  const newItem = new Item({ name: req.body.name });
  await newItem.save();
  res.status(201).json(newItem);
});

// Read a single item by ID
app.get('/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.json(item);
});

// Update an item by ID
app.put('/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!updatedItem) return res.status(404).send('Item not found');
  res.json(updatedItem);
});

// Delete an item by ID
app.delete('/items/:id', async (req, res) => {
  const result = await Item.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send('Item not found');
  res.send(`Item ${req.params.id} deleted`);
});

// Toggle done state
app.patch('/items/:id/toggle', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  item.done = req.body.done;
  await item.save();
  res.json(item);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


module.exports = app;