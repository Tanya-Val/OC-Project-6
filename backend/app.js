// Import the necessary modules
const express = require('express');
// .env configuration
require('dotenv').config();

const app = express();

// Facilitates interactions between Express app and MongoDB database
const mongoose = require('mongoose');

// Imports the routers
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const path = require('path');

//MongoDB connection with .env
const mongo = process.env.MongoDB_CONNECTION


//Parse the body request.
app.use(express.json());

//Allows Cross-Origin Resource Sharing (CORS) for all requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Connection to MongoDB Atlas
mongoose.connect(mongo)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });


//app.use() method  attributes a piece of middleware to a specific route in app.
//Registers routes expected by the front-end app
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Export the Express application for use in other modules
module.exports = app;