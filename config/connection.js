const mongoose = require('mongoose');
require('dotenv').config();

const databaseUrl = process.env.URL;
console.log('MongoDB URI:', databaseUrl); // Check if URI is loaded correctly

const connect=mongoose.connect(databaseUrl)
connect.then(() => {
  console.log('MongoDB connected');
})
.catch(error => {
  console.error('Error connecting to the database:', error);
});

module.exports = connect;
