const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing.js');

const MongoURI = 'mongodb://localhost:27017/roomora';

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MongoURI);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();