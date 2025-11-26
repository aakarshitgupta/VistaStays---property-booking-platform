const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

const app = express();
const port = 3000;
const MongoURI = 'mongodb://localhost:27017/roomora';

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

async function main() {
    await mongoose.connect(MongoURI);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.get('/', (req, res) => {
  res.send('Home Page');
});

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs',{allListings});
}));

// New Route
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});

// Create route
app.post('/listings', wrapAsync(async (req, res) => {
  if(!req.body.listing) {
    throw new ExpressError('Invalid Listing Data', 400);
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
}));

// Show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
  let {id} = req.params;
  const listing =  await Listing.findById(id);
  res.render('listings/show.ejs',{listing});
}));

// Edit route 
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
  let {id} = req.params;
  const listing =  await Listing.findById(id);
  res.render('listings/edit.ejs',{listing});
}));

// Update route
app.put('/listings/:id', wrapAsync(async (req, res) => {
  if(!req.body.listing) {
    throw new ExpressError('Invalid Listing Data', 400);
  }
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect('/listings');
}));

app.use((err, req, res, next) => {
  let { statusCode,message } = err;
  res.render('error.ejs', { statusCode, message });
});

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });