require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

const port = process.env.PORT;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const { new_database_connection } = require('./src/database_connection.js');
const { update_user_database, update_user } = require('./src/update_data.js');
const api = require('./routes/api.js');
const auth = require('./routes/auth.js');

async function run() {
    global.mongo_connection = await new_database_connection();
    app.use(express.static('public'));
    app.use("/api", api);
    app.use("/auth", auth);

    io.on('connection', (socket) => {
        console.log('New socket connection!!');

        // Handle 'toSocketId' event from the client
        socket.on('toSocketId', e => {
            console.log('tosocket');

            try {
                // Emit 'remote' event to the specified socket ID
                io.to(e.socketId).emit('remote', e.message);
            } catch (err) {
                console.log(err);
                socket.emit('status', err);
            }
        });

        let dvId;
        let dbId;
        socket.on('toMyDatabase', message => {
            // Parse JSON data if it's in string format
            new Promise((resolve, reject) => {
                if (typeof message.data === 'string') {
                    try {
                        message.data = JSON.parse(message.data);
                        resolve();
                    } catch (err) {
                        console.error(err);
                        socket.emit('status', 'Malformed Json');
                        reject('Malformed Json');
                    }
                } else {
                    resolve();
                }
            })
                .then(() => {
                    if (typeof message.data === 'object') {
                        if (message.timestamp === true) {
                            Object.keys(message.data).forEach(key => {
                                message.data[key].timestamp = Date.now();
                            });
                        } else {
                            Object.keys(message.data).forEach(key => {
                                if (message.data[key].hasOwnProperty('timestamp')) {
                                    delete message.data[key].timestamp;
                                }
                            });
                        }
                    }

                    var dataToAdd = `{"devices":"${socket.id}"}`;
                    dataToAdd = JSON.parse(dataToAdd);
                    update_user(message.databaseId, dataToAdd, 'addToSet');
                    update_user_database(message.databaseId, message.data, message.method, socket);
                    dbId = message.databaseId;
                    dvId = dataToAdd;
                })
                .catch(err => {
                    console.error(err);
                });
        });

        // Handle 'disconnect' event
        socket.on('disconnect', () => {
            if (dbId && dvId) {
                update_user(dbId, dvId, 'pull');
            }
            // Remove the ID from devices when disconnecting
        });
    });

    server.listen(port, () => {
        console.log(port);
    });
}

run();
