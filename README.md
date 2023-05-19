# mongodb-socket.io-express
## Installation

### Clone the repository:
``` 
bash

git clone https://github.com/tranquochuy645/mongodb-socket.io-express
``` 
### Install dependencies:

``` 
bash

npm install
``` 
### Create the .env file:
``` 
bash

touch .env
``` 
### Add the following environment variables to the .env file:
``` 
makefile

MONGO_URI=your_mongodb_uri
PORT=your_port_number
JWT_KEY=your_jwt_key
``` 
## API Guide

This guide provides information on using the API endpoints provided by the application.
### Create a new user

HTTP request: POST to /auth/create_user/
``` 
json

method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: {
    'username': username,
    'password': password
}
``` 
Example:
``` 
bash

~$ curl -X POST -H "Content-Type: application/json" -d '{"username":"test_user","password":"test_password"}' /auth/create_user/ -w "\nResponse Code: %{http_code}\n"
``` 
### Login/Get your token

HTTP request: POST to /auth/login/
``` 
json

method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: {
    'username': username,
    'password': password
}
``` 
Example:
``` 
bash

~$ curl -X POST -H "Content-Type: application/json" -d '{"username":"test_user","password":"test_password"}' /auth/login/ -w "\nResponse Code: %{http_code}\n"
``` 
### Get your data

HTTP request: GET to /api/get_data/
``` 
json

method: 'GET',
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer' + token
}
``` 
Example:
``` 
bash

~$ curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $$$$Token$$$$" /api/get_data/ -w "\nResponse Code: %{http_code}"
``` 
### Get your device's socketId

HTTP request: GET to /api/get_devices/
``` 
json

method: 'GET',
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer' + token
}
``` 
Example:
``` 
bash

~$ curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $$$$Token$$$$" /api/get_devices/ -w "\nResponse Code: %{http_code}"
``` 
For more information and examples, please refer to the Dashboard page.

Note: Replace $$$$Token$$$$ with your actual token.

## SOCKET.IO GUIDE

Connect to the server using Socket.IO:

In your client application, establish a connection with the Socket.IO server using the appropriate library or framework. Make sure to provide the server's URL and port.

For example, in JavaScript:
``` 
javascript

const socket = io('http://localhost:<port>');
``` 
Handle events and emit messages:

Once connected, you can handle events and emit messages between the client and server.

To handle an event from the server, use the socket.on(eventName, callback) function. Provide the event name and the callback function to be executed when the event is received from the server.

To send a message to the server, use the socket.emit(eventName, data) function. Provide the event name and the data to be sent.
Emit a message to the server's 'toMyDatabase' event:

    To send data to the server's 'toMyDatabase' event, use the socket.emit(eventName, data) function.
    Provide the event name ('toMyDatabase') and the data object containing the required parameters.
    The data object should include the following properties:
        message.databaseId: The ID of the database to update.
        message.data: The data to be sent to the server.
        message.method: The method for updating the user's data (set/unset/push/pull/addToSet).
        message.timestamp (optional): Set it to true if you want to include a timestamp in the data.

Here's an example of how to emit a message to the server:
``` 
javascript

socket.emit('toMyDatabase', {
    databaseId: 'your-database-id',
    data: { /* Your data object */ },
    method: 'addToSet',
    timestamp: true // Optional
});
``` 
Handling server responses and errors:

    To handle server responses or errors, listen for events emitted by the server using socket.on(eventName, callback).
    In this case, you can listen for the 'status' event to receive status updates or error messages from the server.
    Here's an example of how to handle the 'status' event:
    
``` 
javascript

    socket.on('status', (status) => {
        // Handle the status or error message received from the server
    });
``` 
Sending a message to another client by their socket id
``` 
javascript

// Send a message to another client by their socket id
socket.emit('toSocketId', { socketId: 'xyz', message: 'Hi mom' });

// Handle 'toSocketId' event from the server
socket.on('remote', (message) => {
    // Process the received message
});
``` 
