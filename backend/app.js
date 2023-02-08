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


app.use('/api/sauces', (req, res, next) => {
    const stuff = [
        {
            _id: 'ksjch',
            name: 'fisrt',
            manufacturer: 'manuf 1',
            description: 'desc 1',
            heat: 9,
            likes: 8,
            dislikes: 7,
            imageUrl: 'https://img.freepik.com/free-psd/barbecue-sauce-bottle-mockup_47987-3717.jpg?w=2000&t=st=1675357591~exp=1675358191~hmac=b0f507a2209d4415415700226b03bd58512988aca4cd9d6955ed0047e70af03f',
            mainPepper: 'peper 1',
            usersLiked: [],
            usersDisliked: [],
            userId: 'jdsjk',
        },
        {
            _id: 'ksjch',
            name: 'second',
            manufacturer: 'manuf 2',
            description: 'desc 2',
            heat: 6,
            likes: 5,
            dislikes: 4,
            imageUrl: 'https://as2.ftcdn.net/v2/jpg/02/76/29/87/1000_F_276298744_y4UHiqFv3ijUgVxc7ee9njzO1zQ8GHY4.jpg',
            mainPepper: 'peper 2',
            usersLiked: [],
            usersDisliked: [],
            userId: 'jdsjk',
        },
    ];
    res.status(200).json(stuff);
});
//app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;