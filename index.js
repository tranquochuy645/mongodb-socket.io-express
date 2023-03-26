require('dotenv').config();
const fs = require("fs");

const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

