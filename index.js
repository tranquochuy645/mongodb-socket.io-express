require('dotenv').config();


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
const { new_database_connection } = require('./src/database_connection.js');
const { update_user_database, update_user } = require('./src/update_data.js');
// const { get_devices } = require('./src/get_devices.js');
// const { create_user } = require('./src/create_user.js');
// const { login, logout } = require('./src/login.js');
// const { get_data } = require('./src/get_data.js');
const api=require('./routes/api.js');
const auth=require('./routes/auth.js');
// global.mongo_err;
async function run() {
    global.mongo_connection = await new_database_connection();
    app.use(express.static('public'));
    // app.post('/api/create_user', (req, res) => create_user(req, res));
    // app.post('/api/login', (req, res) => login(req, res));
    // app.get('/api/get_data', (req, res) => get_data(req, res));
    // app.get('/api/get_devices', (req, res) => get_devices(req, res));
    // app.delete('/api/login', (req, res) => logout(req, res));
    app.use("/api",api);
    app.use("/auth",auth);

    io.on('connection',
        (socket) => {
            console.log('New socket connection!!');
            socket.on('toSocketId', e => {
                console.log('tosocket');

                try {
                    io.to(e.socketId).emit('remote', e.message);
                } catch (err) {
                    console.log(err)
                    socket.emit('status', err);
                };



                // console.log(message);
                //emit message to device
            });
            socket.on('toMyDatabase', message => {
                // console.log(message)
                try {

                    message.data = JSON.parse(message.data);
                    var dataToAdd = `{"devices":"${socket.id}"}`;
                    dataToAdd = JSON.parse(dataToAdd);
                } catch (err) {
                    console.log(err)
                    socket.emit('status', 'Failed to parse Json object')
                };

                update_user(message.token, dataToAdd, 'addToSet');

                //add the id to devices on first toMyDatabase emit

                update_user_database(message.token, message.data, message.method, socket);




                socket.on('disconnect', () => {

                    update_user(message.token, dataToAdd, 'pull');
                    //remove the id from devices when disconnect
                }
                );



                //upload message.data to mongodb object that have id equal to message.id
            });

        }

    );
    server.listen(port, () => {
        console.log(port)
    });

}









run();