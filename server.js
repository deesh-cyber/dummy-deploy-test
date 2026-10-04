require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4100;
const MONGO_URI = process.env.MONGO_URI;

const Visit = mongoose.model('Visit', new mongoose.Schema({ at: { type: Date, default: Date.now } }));
let dbStatus = 'not connected';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => { dbStatus = 'connected'; console.log('MongoDB connected'); })
    .catch(err => { dbStatus = 'error: ' + err.message; console.error('MongoDB error:', err.message); });
} else {
  console.log('No MONGO_URI set, running without database');
}

app.get('/', async (req, res) => {
  let visits = 'n/a';
  if (dbStatus === 'connected') {
    await Visit.create({});
    visits = await Visit.countDocuments();
  }
  res.send(`<h1>Deployment test works!</h1>
    <p>Port: ${PORT}</p>
    <p>Database: ${dbStatus}</p>
    <p>Total visits saved in MongoDB: ${visits}</p>`);
});

app.get('/health', (req, res) => res.json({ status: 'ok', db: dbStatus }));

app.listen(PORT, () => console.log('Server running on port ' + PORT));
