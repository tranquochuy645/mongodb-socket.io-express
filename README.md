mongodb-socket.io-express
Installation

Clone the repository:

bash

git clone https://github.com/tranquochuy645/mongodb-socket.io-express

Install dependencies:

bash

npm install

Create the .env file:

bash

touch .env

Add the following environment variables to the .env file:

makefile

MONGO_URI=your_mongodb_uri
PORT=your_port_number
JWT_KEY=your_jwt_key

API Guide

This guide provides information on using the API endpoints provided by the application.
Create a new user

HTTP request: POST to /auth/create_user/

json

method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: {
    'username': username,
    'password': password
}

Example:

bash

~$ curl -X POST -H "Content-Type: application/json" -d '{"username":"test_user","password":"test_password"}' /auth/create_user/ -w "\nResponse Code: %{http_code}\n"

Login/Get your token

HTTP request: POST to /auth/login/

json

method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: {
    'username': username,
    'password': password
}

Example:

bash

~$ curl -X POST -H "Content-Type: application/json" -d '{"username":"test_user","password":"test_password"}' /auth/login/ -w "\nResponse Code: %{http_code}\n"

Get your data

HTTP request: GET to /api/get_data/

json

method: 'GET',
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer' + token
}

Example:

bash

~$ curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $$$$Token$$$$" /api/get_data/ -w "\nResponse Code: %{http_code}"

Get your device's socketId

HTTP request: GET to /api/get_devices/

json

method: 'GET',
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer' + token
}

Example:

bash

~$ curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $$$$Token$$$$" /api/get_devices/ -w "\nResponse Code: %{http_code}"

For more information and examples, please refer to the Dashboard page.

Note: Replace $$$$Token$$$$ with your actual token.
SOCKET.IO GUIDE

Connect to the server using Socket.IO:

In your client application, establish a connection with the Socket.IO server using the appropriate library or framework. Make sure to provide the server's URL and port.

For example, in JavaScript:

javascript

const socket = io('http://localhost:<port>');

Handle events and emit messages:

Once connected, you can handle events and emit messages between the client and server.

To handle an event from the server, use the socket.on(eventName, callback) function. Provide the event name and the callback function to be executed when the event is received from the server.

To send a message to the server, use the socket.emit(eventName, data) function. Provide the event name and the data to be sent.

javascript

// Handle 'toSocketId' event from the server
socket.on('remote', (message) => {
    // Process the received message
});

// Send a message to the server
socket.emit('toSocketId', { socketId: 'xyz', message: 'Hello server!' });

Make sure to customize the event names, data, and logic based on your specific application requirements.

The refined README.md provides a clear step-by-step guide for installation, API usage, and Socket.IO functionality.
