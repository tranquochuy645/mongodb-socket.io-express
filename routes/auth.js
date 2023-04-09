// const authMiddleware   = require('../src/authMiddleware');
const router = require('express').Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey=process.env.JWT_KEY;
// function removeDuplicates(arr) {
//     /*
//     This function takes an array as input and returns a new array with duplicates removed.
//     */
//     return Array.from(new Set(arr));
// };
router.post('/create_user',
    (req, res) => {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({ error: 'Invalid content-type' });
        };
        try {
            if (req.body.username == "" || req.body.password == "") {
                res.status(409).send('Empty username or password');
                console.log('empty');
                return;
            };

            const username = req.body.username;

            const password = req.body.password;
            // console.log(req.headers);
            const db = global.mongo_connection.db('database-app');
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
                            // close_database_connection(mongo_connection);

                        } else {

                            var databaseId;

                            db.collection('user_database')
                                .insertOne({})
                                .then((result) => {

                                    if (!result) {
                                        console.log('Failed to create user database');
                                        res.status(500);
                                        return;
                                    } else {
                                        databaseId = result.insertedId;

                                        db.collection('users').insertOne(
                                            {
                                                username: username,
                                                password: password,
                                                databaseId: databaseId,
                                                devices: [],
                                            }
                                        )
                                            .then(
                                                (result) => {
                                                    if (!result) {
                                                        console.error('khong biet sao bug luon =)))');
                                                        res.status(500).send('Error creating user');
                                                        // close_database_connection(mongo_connection);

                                                    } else {
                                                        console.log(`User "${username}" created`);
                                                        res.status(201).send('User created successfully');
                                                        // close_database_connection(mongo_connection);
                                                        // User created successfully.
                                                    }
                                                }
                                            );
                                    }


                                });


                        }
                    }
                );
        } catch (error) {

            return res.status(400).json({ error: 'Malformed JSON' });


        }

    }
);


router.post('/login',
    async (req, res) => {

        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({ error: 'Invalid content-type' });
        };
        try {

            const username = req.body.username;
            const password = req.body.password;
            const db = global.mongo_connection.db('database-app');
            db.collection('users').findOne({
                'username': username,
                'password': password
            })
                .then(user => {

                    if (user) {
                        const token = jwt.sign({ databaseId: user.databaseId.toString() }, secretKey, { expiresIn: '1h' });
                        // var token = user.databaseId.toString();
                        // Successful login

                        // console.log(token);
                        // console.log(token);
                        console.log(`User "${username}" logged in`);

                        res.status(200).send(token);

                        // close_database_connection(mongo_connection);


                        // global.valid_token.push(token);
                        // global.valid_token = removeDuplicates(global.valid_token);
                        // console.log(global.valid_token);



                    } else {
                        // Invalid username/password
                        console.log(`Invalid username/password for user "${username}"`);
                        res.status(401).send('Invalid username/password');
                        // close_database_connection(mongo_connection);
                    };
                    // console.log(token);


                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Error logging in');
                    // close_database_connection(mongo_connection);
                });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: 'Malformed JSON' });

        }

    }
);
router.delete('/login',
    async (req, res) => {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({ error: 'Invalid content-type' });
        }

        try {
           
            // const delete_token = req.headers.token;
            // removeValueFromArray(global.valid_token, delete_token);

            // console.log(global.valid_token);
            res.status(200).send('Logged out');
        } catch (error) {
            return res.status(400).json({ error: 'Malformed JSON' });
        }

    }
);
module.exports = router;

function removeValueFromArray(arr, value) {
    return arr.filter(function (elem) {
        return elem !== value;
    });
};

