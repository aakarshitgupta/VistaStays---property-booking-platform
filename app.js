const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
const port = 3000;
const MongoURI = 'mongodb://localhost:27017/roomora';

async function main() {
    await mongoose.connect(MongoURI);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Home Page');
});