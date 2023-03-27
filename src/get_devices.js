const {new_database_connection,close_database_connection}=require('./database_connection.js');
const ObjectId=require('mongodb').ObjectId;
async function get_devices(req, res) {

    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid content-type' });
    }
    try {
        if (req.headers.token != null) {
            // console.log(req.headers.token);
            
            const token =req.headers.token;
            // console.log(token);
            // console.log(global.valid_token);
            global.valid_token.forEach( async (item) => {
                if (item == token) {
                    //write a function to find the actual data to send istead of this =)))
                    const mongo_connection =await new_database_connection();
                    var o_id = new ObjectId(token);
                    mongo_connection
                    .db('database-app')
                    .collection('users')
                    .findOne(
                        { databaseId: o_id }
                    )
                    .then(
                        result=>{
                            res.send(result.devices);
                            // console.log(result);
                            close_database_connection(mongo_connection);
                        }
                    );
                    
                }
            })
        } else {
            
            res.status(409);
        }
    } catch (errror) {
        return res.status(400).json({ error: 'Malformed JSON' });

    }
};
module.exports = {
    get_devices
};