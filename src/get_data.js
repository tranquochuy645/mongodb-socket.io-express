
const ObjectId=require('mongodb').ObjectId;
async function get_data(req, res) {

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
                   
                    var o_id = new ObjectId(token);
                    global.mongo_connection
                    .db('database-app')
                    .collection('user_database')
                    .findOne(
                        { _id: o_id }
                    )
                    .then(
                        result=>{
                            res.send(result);
                            // console.log(result);
                            
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
    get_data
};