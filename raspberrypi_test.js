const socketio = require('socket.io-client');
const Webcam = require('node-webcam');
const socket = socketio('http://huytran.tech');
const databaseId = '642135fad6d53079497933c3';
// var sensor = require("node-dht-sensor");

const FPS = 10;

var opts = {
    width: 848,
    height: 480,
    frames: 1,
    quality: 100,

    // callbackReturn: "base64",
    callbackReturn: "buffer", // Set the callbackReturn option to "buffer"
    output: "jpeg" // Set the output option to "jpeg"
    // delay: 0
};

socket.emit('toMyDatabase',
    {

        databaseId: databaseId,
        data: { Rasp: "online" },
        timestamp: true
    }
);//first emit !important

// setInterval(() => {
//     const dht = sensor.read(11, 4); // read data from DHT11 sensor connected to GPIO pin 4
//     if (!isNaN(dht.temperature) && !isNaN(dht.humidity)) {
//         socket.emit('toMyDatabase', {
//             databaseId: databaseId,
//             method: 'push',
//             data: {
//                 dht11: {
//                     temp: dht.temperature,
//                     humi: dht.humidity
//                 }
//             },
//             timestamp: true
//         });
//     }
// }, 10000);

var listeners = [];

function removeElementFromArray(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

socket.on('handShake', (app_socketId) => {

    if (!listeners.includes(app_socketId)) {
        listeners.push(app_socketId);
        console.log(app_socketId);

        const itv = setInterval(
            () => {
                Webcam.capture('image', opts, (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    socket.emit('toSocketId',
                        {
                            socketId: app_socketId,
                            message: {
                                header: "image",
                                body: data
                            }
                        });
                });


            }, 1000 / FPS);




        socket.on('offline', e => {
            if (e == app_socketId) {
                removeElementFromArray(listeners, app_socketId);
                clearInterval(itv);
                console.log("clearInterval");
            }
        });
    }
});

socket.on('remote', message => {
    if (message.header == "BRIGHTNESS") {
        socket.emit('toMyDatabase', {
            databaseId: databaseId,
            method: 'set',
            data: {
                "lighting.brightness":message.body
            },
            timestamp: true
        });
        console.log(message.body);
    }
    if (message.header == "RGB") {
        socket.emit('toMyDatabase', {
            databaseId: databaseId,
            method: 'set',
            data: {
                "lighting.RGB":message.body
            },
            timestamp: true
        });
        red = message.body.red;// 0-255
        green = message.body.green;// 0-255
        blue = message.body.blue;// 0-255
        console.log(message.body);
        // code dieu khien mau rgb
    }
});
