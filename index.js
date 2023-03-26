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
// app.use(bodyParser.urlencoded({ extended: true }));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const { route_create_user } = require('./src/create_user.js');
const { login,logout } = require('./src/login.js');
const {get_data} =require('./src/get_data.js');

global.valid_token = [];


app.use(express.static('public'));
app.post('/api/create_user', (req, res) => route_create_user(req, res));
app.post('/api/login', (req, res) => login(req, res));
app.get('/api/get_data', (req, res) => get_data(req,res));
app.delete('/api/login', (req, res) => logout(req,res));

server.listen(port, () => {
    console.log(port)
});

