//mongodb+srv://oc-project6:8PPDu9fCYRc6S314@cluster0.mh4jdwo.mongodb.net/?retryWrites=true&w=majority

const express = require('express');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');
//const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

/*
https://github.com/motdotla/dotenv#Usage
Authentication to MongoDB Atlas by means of query string in dotenv file, '.env' .
*/
const mongo = 'mongodb+srv://oc-project6:8PPDu9fCYRc6S314@cluster0.mh4jdwo.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect(mongo)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

//app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;



/* const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

app.use(express.json());
//n8UDlneyPpUAGDRx
//mongodb+srv://oc_p6_final:<password>@cluster0.xuwrldi.mongodb.net/?retryWrites=true&w=majority

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


mongoose.connect('mongodb+srv://oc_p6_final:n8UDlneyPpUAGDRx@cluster0.xuwrldi.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

app.use((req, res, next) => {
    console.log('Request received!');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({
        message: 'Your request was successful!'
    });
    next();
});

app.use((req, res, next) => {
    console.log('Response sent successfully!');
});

app.use('/api/auth', userRoutes);

module.exports = app; */