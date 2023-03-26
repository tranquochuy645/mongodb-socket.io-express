require('dotenv').config();
const fs = require("fs");
const bodyParser = require('body-parser');

const port = process.env.PORT;
// const mongo_uri = process.env.MONGO_URI;
// const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
// const { dirname } = require('path');

const app = express();
// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const {route_create_user}=require('./src/routes.js');
app.use(express.static('public'));
app.post('/api/create_user/', (req,res)=>route_create_user(req,res));


server.listen(port, () => {
    console.log(port)
});

