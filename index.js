require('dotenv').config();
const fs = require("fs");
const bodyParser = require('body-parser');

const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const { dirname } = require('path');

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

async function new_database_connection() {
    const mongo_client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await mongo_client.connect();
        console.log('created_a_db_connection');
        return mongo_client;


    } catch (error) {
        console.error(error);
    }
};
function close_database_connection(cli) {
    cli.close();
    console.log('closed_a_db_connection');
};

app.use(express.static('public'));
app.post('/api/create_user/', async (req, res) => {
    const mongo_connection = await new_database_connection();
    
    const username = req.body.username;
    const password = req.body.password;
    // console.log(req.headers);
    const db = mongo_connection.db('database-app');
    db.collection('users').findOne(
        {
            'username': username
        }
    )
        .then(
            (user) => {//callback//
                if (user) {
                    console.log(`Username "${username}" already exists`);
                    res.status(409).send('Username already exists');
                    close_database_connection(mongo_connection);
                   
                } else {
                    db.collection('users').insertOne(
                        {
                            username: username,
                            password: password
                        })
                        .then(
                            (err, result) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('Error creating user');
                                    close_database_connection(mongo_connection);
                                   
                                } else {
                                    console.log(`User "${username}" created`);
                                    res.status(201).send('User created successfully');
                                    close_database_connection(mongo_connection);
                            }
                        });

                        
                }
            }
        );
        

});


server.listen(port, () => {
    console.log(port)
});

